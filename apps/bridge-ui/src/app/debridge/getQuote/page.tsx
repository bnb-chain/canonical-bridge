'use client';
import { Box, Button, Flex, Input } from '@node-real/uikit';
import styled from '@emotion/styled';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { formatEther, formatUnits, parseUnits } from 'viem';
import { useAccount, useSendTransaction } from 'wagmi';
import {
  createDeBridgeTxQuote,
  getDeBridgeTxQuote,
} from '@/bridges/debridge/api';
import { useApprove } from '@/contract/hooks';
import { useGetTokenBalance } from '@/contract/hooks/useGetTokenBalance';
import { useGetAllowance } from '@/contract/hooks/useGetAllowance';
import { useTokenAmountInput } from '@/hooks/useTokenAmountInput';

export default function GetQuotePage() {
  const { address } = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  console.log(hash);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [chainInfo, setChainInfo] = useState<{
    srcChain: string;
    dstChain: string;
    srcTokenAddress: `0x${string}` | null;
    dstTokenAddress: `0x${string}` | null;
  }>({
    srcChain: '56',
    dstChain: '137',
    srcTokenAddress: null,
    dstTokenAddress: null,
  });
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const { amount, onChange } = useTokenAmountInput();

  const { approveErc20Token } = useApprove();
  const { balance } = useGetTokenBalance({
    tokenAddress: chainInfo.srcTokenAddress as `0x${string}`,
  });
  const { allowance } = useGetAllowance({
    tokenAddress: quoteData?.estimation.srcChainTokenIn?.address,
    sender: quoteData?.tx?.to,
  });

  const quoteParam = useMemo(() => {
    //  '137': polygon, 1: Ethereum, 56: bsc,
    return {
      srcChainId: chainInfo.srcChain || '56',
      srcChainTokenIn: chainInfo.srcTokenAddress,
      srcChainTokenInAmount: parseUnits(amount.value, 18), // amount and decimal
      dstChainId: chainInfo.dstChain || '137',
      dstChainTokenOut: chainInfo.dstTokenAddress, // native token
      prependOperatingExpenses: false,
      affiliateFeePercent: 0,
      srcChainOrderAuthorityAddress: address,
      dstChainOrderAuthorityAddress: address,
      dstChainTokenOutRecipient: address,
      // dstChainTokenOutAmount: 'auto',
    };
  }, [address, amount.value, chainInfo]);

  const createQuote = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(quoteParam as any);
      const quote = await createDeBridgeTxQuote(urlParams);
      console.log(quote);
      if (quote) {
        setQuoteData(quote);
      }
    } catch (e: any) {
      console.log(e?.response.data);
      if (e?.response.data.errorCode === 12) {
        console.log(e?.response.data.errorId);
      }
    }
  }, [quoteParam]);

  const getQuote = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(quoteParam as any);
      const txQuote = await getDeBridgeTxQuote(urlParams);
      if (txQuote) {
        console.log(txQuote);
        // setQuoteData(quote);
      }
    } catch (e: any) {
      console.log(e?.response.data);
    }
  }, [quoteParam]);

  useEffect(() => {
    if (!address) return;
    const getBalance = async () => {
      if (chainInfo.srcTokenAddress) {
        if (balance) {
          console.log('balance:', balance);
          setTokenBalance(formatUnits(balance, 6));
        }
      }
    };
    getBalance();
  }, [chainInfo?.srcTokenAddress, balance, address]);

  return (
    <Box w={'100%'} maxW={'800px'}>
      Get Quote
      <Flex flexDir={'column'}>
        <TxDetail>{quoteData?.tx?.to || ''}</TxDetail>
        {quoteData?.tx?.value && (
          <TxDetail>You will cost {formatEther(quoteData?.tx?.value)}</TxDetail>
        )}
        {quoteData?.estimation && (
          <Flex flexDir={'column'}>
            <TxDetail>
              You will receive{' '}
              {formatEther(quoteData?.estimation?.dstChainTokenOut.amount)}{' '}
              {quoteData?.estimation?.dstChainTokenOut.symbol}
            </TxDetail>
          </Flex>
        )}
        {hash && <TxDetail>Tx Hash:{}</TxDetail>}

        <Flex gap={'4px'} marginY={'4px'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>Source Chain:</Flex>
          <Input
            w={'400px'}
            defaultValue={chainInfo.srcChain}
            onChange={(e) => {
              setChainInfo((preChain) => {
                if (e.target.value) {
                  return { ...preChain, srcChain: e.target.value };
                }
                return preChain;
              });
            }}
          />
        </Flex>
        <Flex gap={'4px'} marginY={'4px'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>Source Token Address:</Flex>
          <Input
            w={'400px'}
            onChange={(e) => {
              setChainInfo((preChain) => {
                if (e.target.value) {
                  return {
                    ...preChain,
                    srcTokenAddress: e.target.value as `0x${string}`,
                  };
                }
                return preChain;
              });
            }}
          />
        </Flex>

        <Flex gap={'4px'} marginY={'4px'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>Destination Chain:</Flex>
          <Input
            w={'400px'}
            defaultValue={chainInfo.dstChain}
            onChange={(e) => {
              setChainInfo((preChain) => {
                if (e.target.value) {
                  return { ...preChain, dstChain: e.target.value };
                }
                return preChain;
              });
            }}
          />
        </Flex>

        <Flex gap={'4px'} marginY={'4px'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>Dst Token Address:</Flex>
          <Input
            w={'400px'}
            // defaultValue={'0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'}
            onChange={(e) => {
              setChainInfo((preChain) => {
                if (e.target.value) {
                  return {
                    ...preChain,
                    dstTokenAddress: e.target.value as `0x${string}`,
                  };
                }
                return preChain;
              });
            }}
          />
        </Flex>

        <Flex gap={'4px'} marginY={'4px'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>Amount:</Flex>
          <Input w={'400px'} onChange={onChange} />
        </Flex>
        <Box mb={'32px'}>Currently you have {tokenBalance} tokens</Box>
      </Flex>
      <Flex flexDir={'column'} gap="8px">
        <Button
          disabled={
            !chainInfo.dstChain ||
            !chainInfo.srcChain ||
            !chainInfo.dstTokenAddress ||
            !chainInfo.srcTokenAddress ||
            !amount.value
          }
          onClick={getQuote}
        >
          Get Quote
        </Button>
        <Button
          disabled={
            !chainInfo.dstChain ||
            !chainInfo.srcChain ||
            !chainInfo.dstTokenAddress ||
            !chainInfo.srcTokenAddress ||
            !amount.value
          }
          onClick={createQuote}
        >
          Create Quote
        </Button>
        <Button
          disabled={!quoteData}
          onClick={async (e) => {
            e.preventDefault();
            if (quoteData && quoteData?.tx) {
              console.log(
                'send transaction!',
                formatEther(quoteData.tx?.value),
                quoteData.tx?.to
              );
              await sendTransaction({
                to: quoteData.tx?.to,
                data: quoteData.tx?.data,
                value: BigInt(quoteData.tx?.value),
              });

              // hash 0x29c99e86c63853fa5bceeb8b551ea654a7859edd9525d92feba1f02730cee258
            }
          }}
        >
          Swap
        </Button>
        <Button
          disabled={!quoteData}
          onClick={() => {
            approveErc20Token(
              quoteData?.estimation.srcChainTokenIn?.address,
              quoteData.tx.to,
              parseUnits(amount.value, 18)
            );
          }}
        >
          Approve
        </Button>
        <Button
          disabled={!quoteData}
          onClick={async () => {
            if (quoteData?.tx?.to && allowance) {
              console.log('allowance:', allowance);
            }
          }}
        >
          Get Allowance
        </Button>
      </Flex>
    </Box>
  );
}

const TxDetail = styled.div`
  padding:; 10px;
`;
