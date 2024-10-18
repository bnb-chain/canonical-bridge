import { Center, Image } from '@bnb-chain/space';
import { useMemo } from 'react';
import { NextPageContext } from 'next';

import { env } from '@/core/env';

interface ErrorPageProps {
  err?: Error;
  statusCode: number;
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const src = useMemo(() => {
    switch (statusCode) {
      case 500:
        return '500.svg';
      case 404:
        return '404.svg';
      case 403:
        return '403.svg';
      default:
        return '404.svg';
    }
  }, [statusCode]);

  return (
    <Center flex={1}>
      <Image src={`${env.ASSET_PREFIX}/images/${src}`} alt="_error" width={350} height={350} />
    </Center>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
