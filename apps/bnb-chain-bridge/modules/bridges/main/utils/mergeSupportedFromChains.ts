import { MergeSupportedChainsFuncParams, normalizedChains } from './normalizedChains';

export function mergeSupportedFromChains(params: MergeSupportedChainsFuncParams) {
  return normalizedChains(params);
}
