import React, { useState } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    starred: false,
    parent_id: '',
    cardlists: [],
    members: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="dashboard-container">
      <div className="App-header">
        <TopBar />
      </div>
      <div className="dashboard-sidebar">
        <VStack spacing="4" align="stretch">
          <Text fontSize="lg" fontWeight="bold">
            Dashboard
          </Text>
          <Divider />
          <Link>Boards</Link>
          <Link as="button" onClick={onOpen}>Create</Link>
          <Divider/>
          <Link>Archives</Link>
        </VStack>
      </div>
      <div className="dashboard-content">
        <HStack spacing="4" align="stretch" flexWrap="wrap" justifyContent="center" alignItems="center">
          <Box  w="300px"
                h="100px"
                bg="white"
                boxShadow="0 0 20px rgba(0, 0, 0, 0.2)"
                borderRadius="md"
            >
            Board 1
          </Box>
        </HStack>
      </div>

      {/* Modal for Creating Board */}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Board</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight='bold' mb='1rem'>
              Board Title
            </Text>
            <Input name="title" placeholder="Enter board title" value={formData.title} onChange={handleChange} required />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='purple' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='green'>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Dashboard;
