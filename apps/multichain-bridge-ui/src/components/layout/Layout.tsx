import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Flex } from '@node-real/uikit';

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <Flex
        as="main"
        flexDir="column"
        flex={1}
        minH="calc(100vh - 138px)"
        p={24}
        alignItems="center"
      >
        {children}
      </Flex>
      <Footer />
    </>
  );
}
