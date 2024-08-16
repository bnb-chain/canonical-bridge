import { POOL_TRANSFER_BRIDGE } from '@/src/cbridge/abi/poolTransferBridge';
import { ORIGINAL_TOKEN_VAULT } from '@/src/cbridge/abi/originalTokenVault';
import { ORIGINAL_TOKEN_VAULT_V2 } from '@/src/cbridge/abi/originalTokenVaultV2';
import { PEGGED_TOKEN_BRIDGE } from '@/src/cbridge/abi/peggedTokenBridge';
import { PEGGED_TOKEN_BRIDGE_V2 } from '@/src/cbridge/abi/peggedTokenBridgeV2';
import { CBridgeChain, CBridgePeggedPairConfig } from '@/src/cbridge/types';

interface IGetCBridgeTransferAddressInput {
  fromChainId: number;
  isPegged: boolean;
  peggedConfig: CBridgePeggedPairConfig;
  chainConfig: CBridgeChain;
}

interface IGetCBridgeTransferParamsInput {
  amount: bigint;
  isPegged: boolean;
  toChainId: number;
  address: `0x${string}`;
  tokenAddress: `0x${string}`;
  maxSlippage: number;
  transferType: 'deposit' | 'withdraw';
  peggedConfig: CBridgePeggedPairConfig;
}

interface IGetCBridgeABI {
  isPegged: boolean;
  transferType: 'deposit' | 'withdraw';
  peggedConfig?: CBridgePeggedPairConfig;
}

interface IGetCBridgeTransferFunction {
  isPegged: boolean;
  transferType: 'deposit' | 'withdraw';
}

/**
 * Get cBridge contract address from cross chain transfer
 * @param fromChainId Chain ID of the source chain
 * @param isPegged Pool-based transfer(xLiquidity) - false
 *                 Canonical Mapping Transfer(xAsset) - true
 * @param peggedConfig Pegged pair configuration
 * @param chainConfig Chain configuration
 */
export const getCBridgeTransferAddress = ({
  fromChainId,
  isPegged,
  peggedConfig,
  chainConfig,
}: IGetCBridgeTransferAddressInput) => {
  if (isPegged) {
    if (peggedConfig?.org_chain_id === fromChainId) {
      // cBridge deposit
      return peggedConfig.pegged_deposit_contract_addr;
    } else if (peggedConfig?.pegged_chain_id === fromChainId) {
      // cBridge burn
      return peggedConfig.pegged_burn_contract_addr;
    }
  } else {
    if (chainConfig?.contract_addr) {
      return chainConfig?.contract_addr;
    } else {
      throw new Error('No cBridge bridge address found');
    }
  }
};

/**
 * Get cBridge transfer parameters
 * @param amount Send amount
 * @param isPegged Pool-based transfer(xLiquidity) - false
 *                Canonical Mapping Transfer(xAsset) - true
 * @param toChainId Chain ID of the destination chain
 * @param tokenAddress Address of ERC20 token
 * @param address User address
 * @param maxSlippage Maximum slippage
 * @param transferType Transfer type - deposit | withdraw
 * @param peggedConfig Pegged pair configuration
 */
export const getCBridgeTransferParams = ({
  amount,
  isPegged,
  toChainId,
  tokenAddress,
  address,
  maxSlippage,
  transferType,
  peggedConfig,
}: IGetCBridgeTransferParamsInput) => {
  const nonce = new Date().getTime();
  return isPegged === false
    ? [address, tokenAddress, amount, toChainId, nonce, maxSlippage]
    : transferType === 'deposit'
    ? [tokenAddress, amount, toChainId, address as `0x${string}`, nonce]
    : transferType === 'withdraw'
    ? peggedConfig?.bridge_version === 0
      ? [tokenAddress, amount, address as `0x${string}`, nonce]
      : [tokenAddress, amount, toChainId, address as `0x${string}`, nonce]
    : null;
};

/**
 * Get cross chain transfer ABI
 * @param isPegged Pool-based transfer(xLiquidity) - false
 *               Canonical Mapping Transfer(xAsset) - true
 * @param transferType Transfer type - deposit | withdraw
 * @param peggedConfig Pegged pair configuration
 */
export const getCBridgeABI = ({
  isPegged,
  transferType,
  peggedConfig,
}: IGetCBridgeABI) => {
  return isPegged === false || !peggedConfig
    ? POOL_TRANSFER_BRIDGE
    : transferType === 'deposit'
    ? peggedConfig?.vault_version === 0
      ? ORIGINAL_TOKEN_VAULT
      : ORIGINAL_TOKEN_VAULT_V2
    : transferType === 'withdraw'
    ? peggedConfig?.bridge_version === 0
      ? PEGGED_TOKEN_BRIDGE
      : PEGGED_TOKEN_BRIDGE_V2
    : (undefined as any);
};

/**
 * Get cross chain transfer function name
 * @param isPegged
 * @returns string
 */
export const getCBridgeTransferFunction = ({
  isPegged,
  transferType,
}: IGetCBridgeTransferFunction) => {
  return isPegged === false
    ? 'send'
    : transferType === 'deposit'
    ? 'deposit'
    : transferType === 'withdraw'
    ? 'burn'
    : '';
};
