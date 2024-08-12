import { MergeSupportedChainsFuncParams, normalizedChains } from './normalizedChains';

export function mergeSupportedToChains(params: MergeSupportedChainsFuncParams) {
  return normalizedChains(params);
}
