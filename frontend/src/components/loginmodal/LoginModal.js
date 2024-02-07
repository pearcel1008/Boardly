import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
  } from '@chakra-ui/react'
import { useAuth } from '../../AuthContext.js';

  function LoginModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { logIn } = useAuth();  
    return (
      <>
        <Button onClick={onOpen} className='w-full'>Login</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                    suscipit, nisl sit amet tempus elementum, leo sem pharetra dui,
                    ac ultricies arcu augue ac ligula.
                </p>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost' onClick={() => {logIn();}}>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default LoginModal;