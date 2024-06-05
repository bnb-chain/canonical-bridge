// https://developers.flow.com/tools/clients/fcl-js/discovery

import * as fcl from '@onflow/fcl';
import {
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  Image,
  Center,
  ModalCloseButton,
} from '@node-real/uikit';
import flowLogo from '../assets/image.avif';
import { ListItem } from '@/modules/common/components/ListItem';
import { useFlowWallet } from '@/modules/flow/providers/FlowWalletProvider';

export function FlowWalletModal() {
  const { bloctoService, isOpen, isConnected, onClose } = useFlowWallet();

  const onAuthenticate = () => {
    if (isConnected) {
      fcl.unauthenticate();
    }
    fcl.authenticate({ service: bloctoService });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalCloseButton />
      <ModalHeader>Connect Wallet</ModalHeader>
      <ModalBody>
        <ListItem onClick={onAuthenticate}>
          <Text flex={1}>Blocto Wallet</Text>
          <Center boxSize={52} borderRadius="50%" overflow="hidden">
            <Image src={flowLogo} alt="" />
          </Center>
        </ListItem>
      </ModalBody>
      <ModalFooter>
        <Text>By connecting, I accept</Text>
        <Text>
          <Link
            type="link"
            href="https://get.celer.app/cbridge-v2-doc/tos-cbridge-2.pdf"
            target="_blank"
          >
            Terms of Use
          </Link>
        </Text>
      </ModalFooter>
    </Modal>
  );
}
