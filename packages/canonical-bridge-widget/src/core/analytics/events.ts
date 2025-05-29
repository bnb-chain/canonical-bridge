// Import existing types from SDK instead of redefining
import { BridgeType, ChainType } from '@bnb-chain/canonical-bridge-sdk';

// Base event data
export interface BaseEventData {
  timestamp?: number;
  sessionId?: string;
  userId?: string;
}

// Common types
export type WalletType =
  | 'metamask'
  | 'walletconnect'
  | 'coinbase'
  | 'trust'
  | 'rainbow'
  | 'injected'
  | 'phantom'
  | 'solflare'
  | 'backpack'
  | 'glow'
  | 'slope'
  | 'sollet'
  | 'tronlink'
  | 'klever'
  | 'bitkeep'
  | 'okx'
  | 'unknown';

export type BridgeProvider =
  | BridgeType
  | 'wormhole'
  | 'multichain'
  | 'synapse'
  | 'hop'
  | 'across'
  | 'connext';

export type TokenInputMethod = 'manual' | 'max' | 'percentage';
export type TokenSelectionSource = 'dropdown' | 'search' | 'popular' | 'recent';
export type ChainPosition = 'from' | 'to';
export type ModalType =
  | 'approve'
  | 'confirm'
  | 'success'
  | 'error'
  | 'network_switch'
  | 'transaction_details';
export type ModalAction = 'confirm' | 'cancel' | 'close' | 'retry';
export type ErrorType =
  | 'network'
  | 'validation'
  | 'transaction'
  | 'wallet'
  | 'api'
  | 'insufficient_balance'
  | 'user_rejected';

// Event interfaces - organized by category
export interface BridgeEvents {
  click_bridge_fromDropdown: null;
  select_bridge_fromDropdown: {
    fromNetwork: string;
    item_name: string;
  };
  click_bridge_toDropdown: null;
  select_bridge_toDropdown: {
    toNetwork: string;
    item_name: string;
  };
  click_bridge_tokenDropdown: null;
  select_bridge_tokenDropdown: {
    token: string;
    tokenAddress: string;
    item_name: string;
  };
  input_bridge_amount: {
    token: string;
    tokenAddress: string;
    value: string;
    item_name: string;
  };
  click_bridge_max: {
    networkName: string;
    token: string;
    tokenAddress: string;
    value: string;
    item_name: string;
  };
  click_bridge_goal: {
    ctaLabel: 'Connect Wallet' | 'Switch Wallet' | 'Switch Network' | 'Approval' | 'Send';
    item_name: 'Connect Wallet' | 'Switch Wallet' | 'Switch Network' | 'Approval' | 'Send';
  };
  click_bridge_confirmTransfer: {
    fromNetwork: string;
    toNetwork: string;
    bridgeRoute: string;
    token: string;
    tokenAddress: string;
    usdRate: string;
    toToken: string;
    toTokenAddress: string;
    value: string;
    item_category: string;
    item_category2: string;
    item_variant: string;
  };
  click_bridge_approvalModal: {
    fromNetwork: string;
    toNetwork: string;
    token: string;
    tokenAddress: string;
    value: string;
    approvalResult: 'Approve' | 'Deny';
    item_category: string;
    item_category2: string;
    item_variant: 'Approve' | 'Deny';
  };
  transaction_bridge_success: {
    fromNetwork: string;
    toNetwork: string;
    token: string;
    tokenAddress: string;
    usdRate: string;
    toToken: string;
    toTokenAddress: string;
    value: string;
    bridgeRoute: string;
    item_category: string;
    item_category2: string;
    item_variant: string;
  };
  transaction_bridge_fail: {
    fromNetwork: string;
    toNetwork: string;
    token: string;
    tokenAddress: string;
    usdRate: string;
    toToken: string;
    toTokenAddress: string;
    value: string;
    bridgeRoute: string;
    message: string;
    page_location: string;
    item_category: string;
    item_category2: string;
    item_variant: string;
  };
  click_bridge_changeRoute: null;
  click_bridge_refresh: null;
  click_bridge_switchNetwork: null;
}

// Combine all event types
export interface BridgeEventMap extends BridgeEvents {}

// Utility types
export type EventName = keyof BridgeEventMap;
export type BridgeEventName = keyof BridgeEventMap;
export type EventParams<T extends EventName> = BridgeEventMap[T];
export type EventData<T extends EventName> = BaseEventData & EventParams<T>;

// Event listener types with automatic type inference
export type EventListener<T extends EventName> = (eventData: EventData<T>) => void | Promise<void>;

// Event type constants
export const EventTypes = {
  // Bridge UI interaction events
  CLICK_BRIDGE_FROM_DROPDOWN: 'click_bridge_fromDropdown' as const,
  SELECT_BRIDGE_FROM_DROPDOWN: 'select_bridge_fromDropdown' as const,
  CLICK_BRIDGE_TO_DROPDOWN: 'click_bridge_toDropdown' as const,
  SELECT_BRIDGE_TO_DROPDOWN: 'select_bridge_toDropdown' as const,
  CLICK_BRIDGE_TOKEN_DROPDOWN: 'click_bridge_tokenDropdown' as const,
  SELECT_BRIDGE_TOKEN_DROPDOWN: 'select_bridge_tokenDropdown' as const,
  INPUT_BRIDGE_AMOUNT: 'input_bridge_amount' as const,
  CLICK_BRIDGE_MAX: 'click_bridge_max' as const,
  CLICK_BRIDGE_GOAL: 'click_bridge_goal' as const,
  CLICK_BRIDGE_CONFIRM_TRANSFER: 'click_bridge_confirmTransfer' as const,
  CLICK_BRIDGE_APPROVAL_MODAL: 'click_bridge_approvalModal' as const,

  // Bridge transaction events
  TRANSACTION_BRIDGE_SUCCESS: 'transaction_bridge_success' as const,
  TRANSACTION_BRIDGE_FAIL: 'transaction_bridge_fail' as const,

  // Bridge utility events
  CLICK_BRIDGE_CHANGE_ROUTE: 'click_bridge_changeRoute' as const,
  CLICK_BRIDGE_REFRESH: 'click_bridge_refresh' as const,
  CLICK_BRIDGE_SWITCH_NETWORK: 'click_bridge_switchNetwork' as const,
} as const;

export const WalletTypes = {
  METAMASK: 'metamask' as const,
  WALLETCONNECT: 'walletconnect' as const,
  COINBASE: 'coinbase' as const,
  TRUST: 'trust' as const,
  RAINBOW: 'rainbow' as const,
  INJECTED: 'injected' as const,
  PHANTOM: 'phantom' as const,
  SOLFLARE: 'solflare' as const,
  BACKPACK: 'backpack' as const,
  GLOW: 'glow' as const,
  SLOPE: 'slope' as const,
  SOLLET: 'sollet' as const,
  TRONLINK: 'tronlink' as const,
  KLEVER: 'klever' as const,
  BITKEEP: 'bitkeep' as const,
  OKX: 'okx' as const,
  UNKNOWN: 'unknown' as const,
} as const;

export const BridgeProviders = {
  CBRIDGE: 'cBridge' as const,
  DEBRIDGE: 'deBridge' as const,
  STARGATE: 'stargate' as const,
  LAYERZERO: 'layerZero' as const,
  MESON: 'meson' as const,
  MAYAN: 'mayan' as const,
  WORMHOLE: 'wormhole' as const,
  MULTICHAIN: 'multichain' as const,
  SYNAPSE: 'synapse' as const,
  HOP: 'hop' as const,
  ACROSS: 'across' as const,
  CONNEXT: 'connext' as const,
} as const;

// Utility functions
export function isBridgeEvent(eventName: string): eventName is BridgeEventName {
  return Object.values(EventTypes).includes(eventName as any);
}

export function isValidWalletType(walletType: string): walletType is WalletType {
  return Object.values(WalletTypes).includes(walletType as any);
}

export function isValidBridgeProvider(provider: string): provider is BridgeProvider {
  return Object.values(BridgeProviders).includes(provider as any);
}

// Helper function for type-safe event handling
export function createEventHandler<T extends EventName>(
  eventType: T,
  handler: (eventData: EventData<T>) => void | Promise<void>,
) {
  return (eventName: EventName, eventData: EventData<EventName>) => {
    if (eventName === eventType) {
      handler(eventData as EventData<T>);
    }
  };
}

export function asEventData<T extends EventName>(eventData: EventData<EventName>): EventData<T> {
  return eventData as EventData<T>;
}

// Re-export SDK types
export type { ChainType, BridgeType };
