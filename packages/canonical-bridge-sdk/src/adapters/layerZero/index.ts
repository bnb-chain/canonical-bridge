import { ERC20_TOKEN } from '@/abi/erc20Token';
import { CAKE_PROXY_OFT_ABI } from '@/adapters/layerZero/abi/cakeProxyOFT';
import {
  IGetEstimateFeeInput,
  ILayerZeroToken,
  ILayerZeroTokenValidateParams,
  ISendEvmCakeTokenInput,
  ISendSolanaCakeTokenInput,
} from '@/adapters/layerZero/types';
import { Address, encodePacked, formatUnits, Hash, parseUnits, PublicClient, toHex } from 'viem';
import { formatNumber } from '@/shared/number';
import { isEvmAddress } from '@/shared/address';
import { oft } from '@layerzerolabs/oft-v2-solana-sdk';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Connection, PublicKey } from '@solana/web3.js';
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { createSignerFromWalletAdapter, walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import {
  findAssociatedTokenPda,
  mplToolbox,
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder } from '@metaplex-foundation/umi';
import bs58 from 'bs58';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { DEFAULT_SOLANA_ADDRESS } from '@/constants';

const PT_SEND = 0;
const MSG_VALUE_SOLANA = 2_500_000n;
const GAS_LIMIT = 200_000n;
const MIN_AMOUNT_PRECISION = 8;
const GAS_MULTIPLIER = 120n;

type EstimateSendFeeArgs = [number, `0x${string}`, bigint, boolean, `0x${string}`];

export class LayerZero {
  private toBytes32(address: string): `0x${string}` {
    return toHex(addressToBytes32(address));
  }

  private getAdapterParams(gasLimit: bigint, toEvm: boolean): `0x${string}` {
    return toEvm
      ? encodePacked(['uint16', 'uint256'], [1, gasLimit])
      : encodePacked(
        ['uint16', 'uint8', 'uint16', 'uint8', 'bytes'],
        [3, 1, 33, 1, encodePacked(['uint128', 'uint128'], [gasLimit, MSG_VALUE_SOLANA])],
      );
  }

  private async getMinDstGasLimit(
    publicClient: PublicClient,
    bridgeAddress: Address,
    dstEndpoint: number,
  ): Promise<bigint> {
    const gasLimit = await publicClient.readContract({
      address: bridgeAddress,
      abi: CAKE_PROXY_OFT_ABI,
      functionName: 'minDstGasLookup',
      args: [dstEndpoint, PT_SEND],
    });
    return gasLimit !== 0n ? gasLimit : GAS_LIMIT;
  }

  private async estimateNativeFee(
    publicClient: PublicClient,
    bridgeAddress: Address,
    args: EstimateSendFeeArgs,
  ): Promise<bigint> {
    return (await publicClient.readContract({
      address: bridgeAddress,
      abi: CAKE_PROXY_OFT_ABI,
      functionName: 'estimateSendFee',
      args,
    }))[0];
  }

  private getSolanaPublicKeys(
    bridgeAddress: string,
    details: NonNullable<ILayerZeroToken['details']>,
    solanaWallet: WalletContextState,
  ) {
    return {
      tokenMint: fromWeb3JsPublicKey(new PublicKey(bridgeAddress)),
      tokenEscrow: fromWeb3JsPublicKey(new PublicKey(details.escrowTokenAccount)),
      oftProgramId: fromWeb3JsPublicKey(new PublicKey(details.oftProgramId)),
      tokenProgramId: fromWeb3JsPublicKey(new PublicKey(details.innerTokenProgramId)),
      publicKey: fromWeb3JsPublicKey(solanaWallet.publicKey || new PublicKey(DEFAULT_SOLANA_ADDRESS)),
    };
  }

  private getMinAmount(amount: bigint): bigint {
    return parseUnits(
      formatNumber(Number(formatUnits(amount, 18)), MIN_AMOUNT_PRECISION, false),
      18,
    );
  }

  private async createSolanaUmi(
    connection: Connection,
    solanaWallet: WalletContextState,
  ) {
    return createUmi(connection.rpcEndpoint)
      .use(mplToolbox())
      .use(walletAdapterIdentity(solanaWallet));
  }

  async sendEvm(
    {
      publicClient,
      walletClient,
      toAccount,
      bridgeAddress,
      dstEndpoint,
      amount,
    }: ISendEvmCakeTokenInput): Promise<Hash> {
    try {
      const fromAccount = walletClient.account?.address;
      const toEvm = isEvmAddress(toAccount);
      const address32Bytes = this.toBytes32(toAccount);
      const gasLimit = await this.getMinDstGasLimit(publicClient, bridgeAddress, dstEndpoint);
      const adapterParams = this.getAdapterParams(gasLimit, toEvm);
      const minAmount = this.getMinAmount(amount);

      const nativeFee = await this.estimateNativeFee(publicClient, bridgeAddress, [
        dstEndpoint,
        address32Bytes,
        amount,
        false,
        adapterParams,
      ]);

      const callParams = [
        fromAccount,
        '0x0000000000000000000000000000000000000000',
        adapterParams,
      ];

      const contractArgs = {
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'sendFrom',
        args: [fromAccount, dstEndpoint, address32Bytes, amount, minAmount, callParams],
        value: nativeFee,
        account: fromAccount,
      };

      const gas = await publicClient.estimateContractGas(contractArgs as any);
      const gasPrice = await publicClient.getGasPrice();

      return await walletClient.writeContract({
        ...(contractArgs as any),
        gas: (gas * GAS_MULTIPLIER) / 100n,
        gasPrice,
      });
    } catch (error) {
      throw new Error(`Failed to send EVM token: ${error}`);
    }
  }

  async sendSolana(
    {
      toAccount,
      connection,
      solanaWallet,
      bridgeAddress,
      dstEndpoint,
      details,
      amount,
    }: ISendSolanaCakeTokenInput): Promise<string> {
    try {
      const umi = await this.createSolanaUmi(connection, solanaWallet);
      const { tokenMint, tokenEscrow, oftProgramId, tokenProgramId, publicKey } =
        this.getSolanaPublicKeys(bridgeAddress, details!, solanaWallet);

      const recipientBytes32 = addressToBytes32(toAccount);
      const options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, 0);
      const minAmount = this.getMinAmount(amount);

      const { nativeFee } = await oft.quote(
        umi.rpc,
        {
          payer: publicKey,
          tokenMint,
          tokenEscrow,
        },
        {
          payInLzToken: false,
          to: recipientBytes32,
          dstEid: dstEndpoint,
          amountLd: amount,
          minAmountLd: minAmount,
          options: options.toBytes(),
        },
        { oft: oftProgramId },
      );

      const tokenSource = findAssociatedTokenPda(umi, {
        mint: tokenMint,
        owner: publicKey,
        tokenProgramId,
      })[0];

      const instruction = await oft.send(
        umi.rpc,
        {
          payer: createSignerFromWalletAdapter(solanaWallet),
          tokenMint,
          tokenEscrow,
          tokenSource,
        },
        {
          to: recipientBytes32,
          dstEid: dstEndpoint,
          amountLd: amount,
          minAmountLd: minAmount,
          options: options.toBytes(),
          nativeFee,
        },
        { oft: oftProgramId, token: tokenProgramId },
      );

      const transaction = transactionBuilder()
        .add(setComputeUnitPrice(umi, { microLamports: 1000n }))
        .add(setComputeUnitLimit(umi, { units: 500000 }))
        .add([instruction]);

      const { signature } = await transaction.sendAndConfirm(umi);
      return bs58.encode(signature);
    } catch (error) {
      throw new Error(`Failed to send Solana token: ${error}`);
    }
  }

  async getEstimateFee(
    {
      bridgeAddress,
      amount,
      dstEndpoint,
      fromAccount,
      toAccount,
      publicClient,
      solanaWallet,
      connection,
      details,
    }: IGetEstimateFeeInput): Promise<bigint | undefined> {
    const fromEvm = isEvmAddress(bridgeAddress);

    if (!fromEvm) {
      if (!connection || !solanaWallet || !toAccount || !details) {
        return undefined;
      }

      try {
        const umi = await this.createSolanaUmi(connection, solanaWallet);
        const { tokenMint, tokenEscrow, oftProgramId, publicKey } = this.getSolanaPublicKeys(
          bridgeAddress,
          details,
          solanaWallet,
        );

        const recipientBytes32 = addressToBytes32(toAccount);
        const options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, 0);
        const minAmount = this.getMinAmount(amount);

        const { nativeFee } = await oft.quote(
          umi.rpc,
          {
            payer: publicKey,
            tokenMint,
            tokenEscrow,
          },
          {
            payInLzToken: false,
            to: recipientBytes32,
            dstEid: dstEndpoint,
            amountLd: amount,
            minAmountLd: minAmount,
            options: options.toBytes(),
          },
          { oft: oftProgramId },
        );

        return nativeFee;
      } catch (error) {
        throw new Error(`Failed to estimate Solana fee: ${error}`);
      }
    }

    if (!publicClient) {
      return undefined;
    }

    try {
      const address32Bytes = this.toBytes32(fromAccount);
      const gasLimit = await this.getMinDstGasLimit(publicClient, bridgeAddress, dstEndpoint);
      const adapterParams = this.getAdapterParams(gasLimit, isEvmAddress(toAccount));

      return await this.estimateNativeFee(publicClient, bridgeAddress, [
        dstEndpoint,
        address32Bytes,
        amount,
        false,
        adapterParams,
      ]);
    } catch (error) {
      throw new Error(`Failed to estimate EVM fee: ${error}`);
    }
  }

  async validateLayerZeroToken(
    {
      fromPublicClient,
      toPublicClient,
      bridgeAddress,
      fromTokenAddress,
      fromTokenSymbol,
      fromTokenDecimals,
      toTokenAddress,
      toTokenSymbol,
      toTokenDecimals,
      toBridgeAddress,
      dstEndpoint,
      amount,
    }: ILayerZeroTokenValidateParams): Promise<boolean> {
    // Validate amount
    if (Number(amount) <= 0) {
      console.log('Invalid send amount:', amount);
      return false;
    }

    // Determine transfer type
    const isFromEvm = isEvmAddress(fromTokenAddress);
    const isToEvm = isEvmAddress(toTokenAddress);
    const isEvmToEvm = isFromEvm && isToEvm;
    const isEvmToSolana = isFromEvm && !isToEvm;
    const isSolanaToEvm = !isFromEvm && isToEvm;

    // Validate required EVM-related parameters
    const requiredEvmParams: Record<string, unknown> = {};

    if (isEvmToEvm || isEvmToSolana) {
      Object.assign(requiredEvmParams, {
        fromPublicClient,
        bridgeAddress,
        fromTokenAddress,
        fromTokenSymbol,
        fromTokenDecimals,
        dstEndpoint,
      });
    }

    if (isEvmToEvm || isSolanaToEvm) {
      Object.assign(requiredEvmParams, {
        toPublicClient,
        toBridgeAddress,
        toTokenAddress,
        toTokenSymbol,
        toTokenDecimals,
      });
    }

    for (const [key, value] of Object.entries(requiredEvmParams)) {
      if (!value) {
        console.log(`Missing required EVM parameter: ${key}`);
        console.log('EVM Parameters:', requiredEvmParams);
        return false;
      }
    }

    // Validate EVM contract addresses
    const evmAddresses: Record<string, string> = {};

    if (isEvmToEvm || isEvmToSolana) {
      Object.assign(evmAddresses, { bridgeAddress, fromTokenAddress });
    }

    if (isEvmToEvm || isSolanaToEvm) {
      Object.assign(evmAddresses, { toBridgeAddress, toTokenAddress });
    }

    for (const [key, address] of Object.entries(evmAddresses)) {
      if (!isEvmAddress(address)) {
        console.log(`Invalid EVM contract address for ${key}:`, address);
        return false;
      }
    }

    try {
      // Validate EVM token details
      if (isEvmToEvm || isEvmToSolana) {
        const [fromContractSymbol, fromContractDecimals] = await Promise.all([
          fromPublicClient!.readContract({
            address: fromTokenAddress as `0x${string}`,
            abi: ERC20_TOKEN,
            functionName: 'symbol',
          }),
          fromPublicClient!.readContract({
            address: fromTokenAddress as `0x${string}`,
            abi: ERC20_TOKEN,
            functionName: 'decimals',
          }),
        ]);

        if (fromContractSymbol.toLowerCase() !== fromTokenSymbol.toLowerCase()) {
          console.log('From token symbol mismatch:', { expected: fromTokenSymbol, actual: fromContractSymbol });
          return false;
        }

        if (fromContractDecimals !== fromTokenDecimals) {
          console.log('From token decimals mismatch:', { expected: fromTokenDecimals, actual: fromContractDecimals });
          return false;
        }
      }

      if (isEvmToEvm || isSolanaToEvm) {
        const [toTokenContractSymbol, toTokenContractDecimals] = await Promise.all([
          toPublicClient!.readContract({
            address: toTokenAddress as `0x${string}`,
            abi: ERC20_TOKEN,
            functionName: 'symbol',
          }),
          toPublicClient!.readContract({
            address: toTokenAddress as `0x${string}`,
            abi: ERC20_TOKEN,
            functionName: 'decimals',
          }),
        ]);

        if (toTokenContractSymbol.toLowerCase() !== toTokenSymbol.toLowerCase()) {
          console.log('To token symbol mismatch:', { expected: toTokenSymbol, actual: toTokenContractSymbol });
          return false;
        }

        if (toTokenContractDecimals !== toTokenDecimals) {
          console.log('To token decimals mismatch:', { expected: toTokenDecimals, actual: toTokenContractDecimals });
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }
}
