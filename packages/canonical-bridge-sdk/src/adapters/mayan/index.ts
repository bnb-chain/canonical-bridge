import {
  IMayanQuotaInput,
  IMayanQuotaInputExtra,
  IMayanToken,
  IMayanTokenValidateParams,
} from '@/adapters/mayan/types';
import {
  ChainName,
  fetchQuote,
  getSwapFromEvmTxPayload,
  Quote,
  ReferrerAddresses,
  SolanaTransactionSigner,
  swapFromSolana,
} from '@mayanfinance/swap-sdk';
import { isNativeToken, isValidTokenAddress } from '@/shared/address';
import { VALIDATION_API_TIMEOUT } from '@/constants';
import axios from 'axios';
import { PublicClient, WalletClient } from 'viem';
import { IBaseBridgeConfig } from '@/core';
import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export class Mayan {
  private readonly endpoint: string;
  private referrer: ReferrerAddresses = {};

  constructor(config: IBaseBridgeConfig) {
    this.endpoint = config.endpoint;
  }

  async getEstimatedFees({ extra, ...options }: IMayanQuotaInput) {
    const { referrer, ...rest } = extra as Required<IMayanQuotaInputExtra>;
    this.referrer = referrer;

    try {
      return await fetchQuote({
        ...options,
        ...rest,
        referrer: referrer?.solana || '',
        fromChain: options.fromChain as ChainName,
        toChain: options.toChain as ChainName,
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.message) {
        console.log('Mayan fee error', error);
        throw error;
      } else {
        throw new Error(`Failed to get Mayan fees ${error}`);
      }
    }
  }

  async validateMayanToken(params: IMayanTokenValidateParams) {
    const {
      fromChainNameId,
      fromChainType,
      toChainNameId,
      toChainType,
      fromTokenAddress,
      fromTokenSymbol,
      fromTokenDecimals,
      fromBridgeAddress,
      toTokenAddress,
      toTokenSymbol,
      toTokenDecimals,
      amount,
    } = params;

    try {
      if (Number(amount) <= 0) {
        console.log('Invalid mayan token amount');
        return false;
      }

      if (
        !fromChainNameId ||
        !fromChainType ||
        !fromTokenAddress ||
        !toTokenAddress ||
        !fromTokenSymbol ||
        !toTokenSymbol ||
        !toChainNameId ||
        !toChainType ||
        !amount ||
        !fromTokenDecimals ||
        (!fromBridgeAddress && fromChainType === 'evm') ||
        !toTokenDecimals
      ) {
        console.log('Invalid mayan token validation params');
        console.log('-- fromChainNameId', fromChainNameId);
        console.log('-- fromChainType', fromChainType);
        console.log('-- fromTokenSymbol', fromTokenSymbol);
        console.log('-- fromTokenAddress', fromTokenAddress);
        console.log('-- fromTokenDecimals', fromTokenDecimals);
        console.log('-- fromBridgeAddress', fromBridgeAddress);
        console.log('-- toChainNameId', toChainNameId);
        console.log('-- toChainType', toChainType);
        console.log('-- toTokenSymbol', toTokenSymbol);
        console.log('-- toTokenAddress', toTokenAddress);
        console.log('-- toTokenDecimals', toTokenDecimals);
        console.log('-- amount', amount);
        return false;
      }

      // Check from token address
      const isValidFromToken = isValidTokenAddress({
        contractAddress: fromTokenAddress,
        chainType: fromChainType,
        isSourceChain: true,
      });

      // Check to token address
      const isValidToToken = isValidTokenAddress({
        contractAddress: toTokenAddress,
        chainType: toChainType,
        isSourceChain: true,
      });

      if (!isValidFromToken || !isValidToToken) {
        console.log(
          'Invalid mayan bridge token address',
          fromTokenAddress,
          toTokenAddress,
        );
        return false;
      }

      // Check mayan contract address
      if (fromChainType !== 'solana') {
        const isValidBridgeContractAddress = isValidTokenAddress({
          contractAddress: fromBridgeAddress,
          chainType: fromChainType,
          isSourceChain: true,
        });
        if (!isValidBridgeContractAddress) {
          console.log(
            'Invalid mayan bridge contract address',
            fromBridgeAddress,
          );
          return false;
        }
      }

      // Check token info on API
      const fromRequest = axios.get<Record<string, IMayanToken[]>>(`${this.endpoint}/tokens?chain=${fromChainNameId}&nonPortal=true`, {
        timeout: VALIDATION_API_TIMEOUT,
      });
      const toRequest = axios.get<Record<string, IMayanToken[]>>(`${this.endpoint}/tokens?chain=${toChainNameId}&nonPortal=true`, {
        timeout: VALIDATION_API_TIMEOUT,
      });

      const [fromTokenList, toTokenList] = await Promise.allSettled([
        fromRequest,
        toRequest,
      ]);

      if (
        fromTokenList.status === 'fulfilled' &&
        toTokenList.status === 'fulfilled'
      ) {
        const fromTokenAddr =
          fromChainType === 'solana'
            ? fromTokenAddress
            : fromTokenAddress.toLowerCase();
        const toTokenAddr =
          toChainType === 'solana'
            ? toTokenAddress
            : toTokenAddress.toLowerCase();
        const fromToken = (fromTokenList?.value?.data?.[fromChainNameId] || []).filter(token => {
          return fromChainType === 'solana'
            ? isNativeToken(token.contract, 'solana') ? isNativeToken(fromTokenAddr, 'solana') : token.contract === fromTokenAddr
            : token.contract.toLowerCase() === fromTokenAddr;
        })[0];
        const toToken = (toTokenList?.value?.data?.[toChainNameId] || []).filter(token => {
          return toChainNameId === 'solana'
            ? isNativeToken(token.contract, 'solana') ? isNativeToken(toTokenAddr, 'solana') : token.contract === toTokenAddr
            : token.contract.toLowerCase() === toTokenAddr;
        })[0];

        if (!toToken) {
          console.log('Can not find toToken info');
        }
        if (!fromToken) {
          console.log('Can not find fromToken info');
        }
        if (
          !!fromToken &&
          fromToken?.contract.toLowerCase() === fromTokenAddress.toLowerCase() &&
          fromToken?.symbol === fromTokenSymbol &&
          fromToken?.decimals === fromTokenDecimals &&
          !!toToken &&
          toToken?.contract.toLowerCase() === toTokenAddress.toLowerCase() &&
          toToken?.symbol === toTokenSymbol &&
          toToken?.decimals === toTokenDecimals
        ) {
          console.log('Mayan token info matched', fromToken);
          return true;
        }
      } else {
        console.log(
          'Failed to get Mayan API token info',
          fromTokenList,
          toTokenList,
        );
        return false;
      }

      console.log('Could not find Mayan token info');
      console.log('-- fromChainNameId', fromChainNameId);
      console.log('-- from fromChainType', fromChainType);
      console.log('-- from tokenSymbol', fromTokenSymbol);
      console.log('-- from tokenAddress', fromTokenAddress);
      console.log('-- from TokenDecimals', fromTokenDecimals);
      console.log('-- to ChainNameId', toChainNameId);
      console.log('-- to ChainType', toChainType);
      console.log('-- to tokenSymbol', toTokenSymbol);
      console.log('-- to tokenAddress', toTokenAddress);
      console.log('-- to TokenDecimals', toTokenDecimals);
      console.log('-- amount', amount);
      return false;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('Mayan token validation error', error);
      return false;
    }
  }

  async swapSolana(quote: Quote, connection: Connection, solanaWallet: WalletContextState, destAddr: string) {
    const signer = async (
      trx: Transaction | VersionedTransaction,
    ): Promise<Transaction | VersionedTransaction> => {
      return await solanaWallet.signTransaction!(trx);
    };

    const swapRes = await swapFromSolana(
      quote,
      solanaWallet.publicKey!.toString()!,
      destAddr,
      this.referrer || null,
      signer as SolanaTransactionSigner,
      connection,
      [],
      { skipPreflight: true },
    );

    if (!swapRes.signature) {
      throw new Error('Mayan Transaction failed');
    }

    try {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const result = await connection.confirmTransaction(
        {
          signature: swapRes.signature,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );
      if (result?.value.err) {
        throw new Error(`Mayan Transaction ${swapRes.serializedTrx} reverted!`);
      }

      console.log(`Mayan Transaction sent: ${swapRes.signature}`);
      return swapRes.signature;
    } catch (error) {
      console.log(error);
      throw new Error('Mayan Transaction failed');
    }
  }

  async swapEVM(
    quote: Quote,
    walletClient: WalletClient,
    publicClient: PublicClient,
    walletSrcAddr: `0x${string}`,
    destAddr: string,
    fromChainId: number) {

    const txPayload = getSwapFromEvmTxPayload(
      quote,
      walletSrcAddr, // swapperAddress
      destAddr,
      this.referrer || null, // referrerAddresses
      walletSrcAddr,
      fromChainId, // signerChainId
      null, // payload
      null, // permit
    );

    const txHash = await walletClient.sendTransaction({
      account: walletSrcAddr,
      to: txPayload.to as `0x${string}`,
      data: txPayload.data as `0x${string}`,
      value: BigInt(txPayload.value || 0),
      chain: walletClient.chain,
    });

    console.log(`Mayan Transaction sent: ${txHash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    if (receipt.status === 'success') {
      console.log('Mayan Swap transaction confirmed!');
      return txHash;
    } else {
      throw new Error('Mayan Transaction failed');
    }
  }
}