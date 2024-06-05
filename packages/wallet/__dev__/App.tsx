import { WalletProvider, useAccount, useDisconnect, useModal } from '@/index';
import { ThemeProvider } from '@node-real/uikit';
import { theme } from './theme';

function Wallet() {
  const { onOpen } = useModal();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  return (
    <>
      <div>
        account: {address}, isConnected: {isConnected ? 'true' : 'false'}
      </div>
      <div onClick={() => onOpen('evm')}>open</div>
      <div onClick={() => disconnect()}>disconnect</div>
    </>
  );
}

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <WalletProvider>
        <Wallet />
      </WalletProvider>
    </ThemeProvider>
  );
}
