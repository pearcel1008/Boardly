import React, { useState } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, Flex, bgGradient, Center, Heading } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { AddIcon } from '@chakra-ui/icons';

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
  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigateToBoard = () => {
    // Navigate to board
    navigate('/board1');
  }

  return (
    <Flex className="dashboard-container"  bgGradient='linear(to-tl, #211938, #271c4d )'>
      <div className="App-header">
        <TopBar />
      </div>
      <Flex className="dashboard-sidebar h-full w-1/6 text-white justify-center py-20 drop-shadow-md" bg={theme.colors.brand.menubutton}>
        <VStack spacing="4" align="stretch">
            <Button className='' onClick={onOpen}
              bg={isOpen ? theme.colors.brand.ultraviolet : theme.colors.brand.semiprimary} 
              color={isOpen ? 'white' : 'white'} 
              borderColor={isOpen ? theme.colors.brand.spacecadet : 'initial'} 
              _hover={{
                bg: theme.colors.brand.ultraviolet,
                color: theme.colors.brand.mauve,
                borderColor: theme.colors.brand.spacecadet,
            }}>
            Create Board
            <AddIcon className='ml-2' boxSize={3}/>
            </Button>
          <Divider/>
          <Button className=''
              bg={theme.colors.brand.menubutton} 
              color={'white'} 
              borderColor={theme.colors.brand.spacecadet} 
              _hover={{
                bg: theme.colors.brand.ultraviolet,
                color: theme.colors.brand.mauve,
                borderColor: theme.colors.brand.spacecadet,
                }}
                _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}
            >
            Archives
            </Button>
        </VStack>
      </Flex>
      <Flex className="dashboard-content" >
        <HStack spacing="4" align="stretch" flexWrap="wrap" justifyContent="center" alignItems="center">
          <Box  className='cursor-pointer  text-white py-2'
                w="300px"
                h="100px"
                bg={theme.colors.brand.menubutton}
                boxShadow="0 0 20px rgba(0, 0, 0, 0.3)"
                borderRadius="md"
                onClick={navigateToBoard}
                _hover={{bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve}}
                _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}
            >
            <Heading size='sm'>Board 1</Heading>
          </Box>
        </HStack>
      </Flex>

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
      
    </Flex>
  );
}

export default Dashboard;
