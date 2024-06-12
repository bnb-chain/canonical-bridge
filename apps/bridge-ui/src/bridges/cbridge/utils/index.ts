import { ethers } from 'ethers';

// CBridge Transfer ID for tracking status
export const getTransferId = (
  transferType:
    | 'deposit'
    | 'deposit2' // vault_version 2
    | 'withdraw'
    | 'withdraw2' // vault_version 2
    | 'pool',
  args: any
) => {
  let type = null;
  if (transferType === 'pool') {
    type = [
      'address', // user's wallet address
      'address', // user's wallet address
      'address', // ERC20 token address
      'uint256', //amount
      'uint64', // destination chain id
      'uint64', // nonce
      'uint64', // source chain id
    ];
  } else if (transferType === 'deposit') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'uint64', // dst chain id
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
    ];
  } else if (transferType === 'deposit2') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'uint64', // dst chain id
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
      'address', // bridge address
    ];
  } else if (transferType === 'withdraw') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
    ];
  } else if (transferType === 'withdraw2') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'uint64', // dst chain id
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
      'address', // bridge address
    ];
  } else {
    // eslint-disable-next-line no-console
    console.log('Invalid transfer type');
    return '';
  }
  return ethers.utils.solidityKeccak256(type, args);
};
