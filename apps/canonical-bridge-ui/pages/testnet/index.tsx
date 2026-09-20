import dynamic from 'next/dynamic';

export default dynamic(() => import('@/core/pages/TestnetPage'), { ssr: false });
