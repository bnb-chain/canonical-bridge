import { BaseAdapter } from '@/adapters/base';
import { ITransferTokenPair } from '@/adapters/base/types';
import { CAKE_PROXY_OFT_ABI } from '@/adapters/layerZero/exports';
import {
  ILayerZeroTransferConfig,
  ILayerZeroChain,
  ILayerZeroToken,
  ISendCakeTokenInput,
  IGetEstimateFeeInput,
} from '@/adapters/layerZero/types';
import { BridgeType } from '@/aggregator/types';
import { formatNumber } from '@/shared/number';
import { encodePacked, formatUnits, Hash, pad, parseUnits } from 'viem';

export class LayerZeroAdapter extends BaseAdapter<
  ILayerZeroTransferConfig,
  ILayerZeroChain,
  ILayerZeroToken
> {
  public bridgeType: BridgeType = 'layerZero';

  /**
   * Send token through layerZero V1 OFT
   * https://docs.layerzero.network/v1/developers/evm/evm-guides/advanced/relayer-adapter-parameters
   *
   * @param userAddress User address
   * @param bridgeAddress Bridge address
   * @param amount Send amount
   * @param dstEndpoint Destination endpoint
   * @param publicClient Public client
   * @param walletClient Wallet client
   * @param gasAmount Gas amount
   * @param version Relayer adapter parameters version
   */
  async sendToken({
    userAddress,
    bridgeAddress,
    amount,
    dstEndpoint,
    publicClient,
    walletClient,
    gasAmount = 200000n,
    version = 1,
  }: ISendCakeTokenInput): Promise<Hash> {
    try {
      const address32Bytes = pad(userAddress, { size: 32 });
      const adapterParams = encodePacked(
        ['uint16', 'uint256'],
        [version, gasAmount]
      );
      const fees = await publicClient.readContract({
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'estimateSendFee',
        args: [
          dstEndpoint,
          address32Bytes,
          amount,
          false,
          adapterParams as `0x${string}`,
        ],
      });
      const callParams = [
        userAddress,
        '0x0000000000000000000000000000000000000000', // zroPaymentAddress
        adapterParams,
      ];
      const nativeFee = fees[0];
      const minAmount = parseUnits(
        String(formatNumber(Number(formatUnits(amount, 18)), 8)),
        18
      );
      const cakeArgs = {
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'sendFrom',
        args: [
          userAddress,
          dstEndpoint,
          address32Bytes,
          amount,
          minAmount,
          callParams,
        ],
        value: nativeFee,
        account: userAddress,
      };
      const gas = await publicClient.estimateContractGas(cakeArgs as any);
      const gasPrice = await publicClient.getGasPrice();
      const hash = await walletClient.writeContract({
        ...(cakeArgs as any),
        gas,
        gasPrice,
      });
      return hash;
    } catch (error: any) {
      throw new Error(`Failed to send CAKE token ${error}`);
    }
  }

  /**
   * Get estimate fee
   * @param bridgeAddress Bridge address
   * @param amount Send amount
   * @param dstEndpoint Destination endpoint
   * @param userAddress User address
   * @param publicClient Public client
   * @param gasAmount Gas amount
   * @param version Relayer adapter parameters version
   * @returns Estimate fee
   */
  async getEstimateFee({
    bridgeAddress,
    amount,
    dstEndpoint,
    userAddress,
    publicClient,
    gasAmount = 200000n,
    version = 1,
  }: IGetEstimateFeeInput) {
    try {
      const address32Bytes = pad(userAddress, { size: 32 });
      const adapterParams = encodePacked(
        ['uint16', 'uint256'],
        [version, gasAmount]
      );
      const fees = await publicClient.readContract({
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'estimateSendFee',
        args: [
          dstEndpoint,
          address32Bytes,
          amount,
          false,
          adapterParams as `0x${string}`,
        ],
      });
      return fees;
    } catch (error: any) {
      throw new Error(`Failed to get estimate fee ${error}`);
    }
  }

  protected initChains() {
    const { chains, tokens } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(chain.chainId);
      const isExcludedChain = this.excludedChains.includes(chain.chainId);
      const hasToken = tokens[chain.chainId]?.length > 0;
      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, ILayerZeroChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(chain.chainId, chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const { tokens } = this.config;

    const tokenMap = new Map<number, ILayerZeroToken[]>();
    const symbolMap = new Map<number, Map<string, ILayerZeroToken>>();
    Object.entries(tokens).forEach(([id, chainTokens]) => {
      const chainId = Number(id);

      const filteredTokens = chainTokens.filter((token) => {
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token.symbol?.toUpperCase(),
          tokenAddress: token.address,
        });
        return !isExcludedToken;
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, ILayerZeroToken>());

        filteredTokens.forEach((token) => {
          symbolMap.get(chainId)?.set(token.symbol, token);
        });

        tokenMap.set(chainId, filteredTokens);
      }
    });

    this.tokenMap = tokenMap;
    this.symbolMap = symbolMap;
  }

  protected initTransferMap() {
    const transferMap = new Map<
      number,
      Map<number, Map<string, ITransferTokenPair<ILayerZeroToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (
          fromChain.chainId !== toChain.chainId &&
          fromChain.network === toChain.network
        ) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const transferableTokenMap = new Map<
            string,
            ITransferTokenPair<ILayerZeroToken>
          >();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<ILayerZeroToken> = {
                fromChainId: fromChain.chainId,
                toChainId: toChain.chainId,
                fromToken,
                toToken,
                fromTokenAddress: fromToken.address,
                toTokenAddress: toToken.address,
              };
              transferableTokenMap.set(fromToken.symbol, tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<
                  number,
                  Map<string, ITransferTokenPair<ILayerZeroToken>>
                >()
              );
            }
            transferMap
              .get(fromChain.chainId)
              ?.set(toChain.chainId, transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: ILayerZeroChain) {
    return chain.chainId;
  }

  public getTokenInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: ILayerZeroToken;
  }) {
    return {
      name: (token as any).name, // TODO
      symbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.address,
        defaultSymbol: token.symbol,
      }),
    };
  }
}
