import * as fcl from '@onflow/fcl';

export function useDisconnect() {
  return {
    disconnect: () => {
      fcl.unauthenticate();
    },
  };
}
