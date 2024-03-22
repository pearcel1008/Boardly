import React, { useState } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, StackDivider, Icon } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Flex,
    Heading,
    Stack,
  } from '@chakra-ui/react';
  import { useTheme } from '@chakra-ui/react';
  import { FaGithub, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { ChevronLeftIcon, AddIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';


const Board = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    // Access the boards using location
    const boardId = location.state;
    console.log(boardId.ID); // THIS IS THE BOARD ID FOR API PURPOSES (parent_id is user_id)

    const [displayCardlists, setDisplayCardlists] = useState([]);
    const [formData, setFormData] = useState({
      title: '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleCreateCardlist = async (e) => {
        var currentURL = window.location.href;
        var parts = currentURL.split('=');
        var boardID = parts[1];
        console.log(boardID);
        console.log(formData.title)
        //Create user
        try {
          const response = await fetch('http://localhost:8000/boardly/cardlist/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: "",
                title: formData.title,
                cards: [],
                order: 0,
                parent_id: boardID
              })
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          console.log('Board created successfully:', data);
          // Reset form fields after successful submission
          setFormData({
            title: ''
          });
        } catch (error) {
          console.error('Error creating board:', error);
        }
        handleShowCardlists();
        onClose();
      };

    const handleShowCardlists = async (e) => {
        var currentURL = window.location.href;
        var parts = currentURL.split('=');
        const boardID = parts[1];
        console.log(boardID);
        // console.log(formData.title);
        try {    
            const boardData = await fetch(`http://localhost:8000/boardly/cardlist/get/boards?board_id=${boardId.ID}`);
            if (!boardData.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await boardData.json();
            console.log(data);

            setDisplayCardlists(data);

        } catch (error) {
            console.error('Error showing cardlist:', error);
        }
    };

    useEffect(() => {
        handleShowCardlists(); // Fetch data when component mounts
      }, []);


    const handleNavigateDashboard = async (e) => {
        const response = await fetch(`http://localhost:8000/boardly/board/get?id=${boardId.ID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        const data = await response.json();
        const userID = data.parent_id;
        
        window.location.href = `http://localhost:3000/dashboard?user_id=${userID}`; 
        navigate('/dashboard');
      };  
    return (
        <Flex className="board-container" bgGradient='linear(to-tl, #211938, #271c4d )' >
            <div className="App-header">
                <TopBar />
            </div>
            <HStack className="board-header" justifyContent="space-between" alignItems="center">
                <Button className="my-20 mx-5 text-white" bg='transparent' _hover={{color: theme.colors.brand.mauve, bg: theme.colors.transparent}} onClick={handleNavigateDashboard}>
                    <Icon as={ChevronLeftIcon} w={6} h={6} color="white" _hover={{color: theme.colors.brand.mauve, bg: theme.colors.transparent}} 
                    />
                </Button>
                <Button className='' onClick={onOpen}
                bg={isOpen ? theme.colors.brand.ultraviolet : theme.colors.brand.semiprimary} 
                color={isOpen ? 'white' : 'white'} 
                borderColor={isOpen ? theme.colors.brand.spacecadet : 'initial'} 
                _hover={{
                    bg: theme.colors.brand.ultraviolet,
                    color: theme.colors.brand.mauve,
                    borderColor: theme.colors.brand.spacecadet,
                }}>
                Create Cardlist
                <AddIcon className='ml-2' boxSize={3}/>
                </Button>
            </HStack>
            <Flex className="board-content px-10">
                <HStack spacing="4" align="stretch" flexWrap="wrap" justifyContent="center" alignItems="center">
                    {displayCardlists.map((board, index) => (
                        <Box  key={index}
                                className='cursor-pointer  text-white py-2'
                                w="300px"
                                h="100px"
                                bg={theme.colors.brand.menubutton}
                                boxShadow="0 0 20px rgba(0, 0, 0, 0.3)"
                                borderRadius="md"
                                _hover={{bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve}}
                                _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}
                                // onClick={() => handleBoardClick(board.id)} // TODO: not sure what to do here yet, this will probably end up being movement
                            >
                            <Heading size='sm'>{board.title}</Heading>
                        </Box>
                    ))}
                </HStack>
        </Flex>

        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Create Cardlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight='bold' mb='1rem'>
                        Cardlist Title
                        </Text>
                        <Input name="title" placeholder="Enter cardlist title" value={formData.title} onChange={handleChange} required />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='purple' mr={3} onClick={onClose}>
                        Cancel
                        </Button>
                        <Button colorScheme='green' onClick={handleCreateCardlist}>Create</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>

        </Flex>
    );
};
export default Board;