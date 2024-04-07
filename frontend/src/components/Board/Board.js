import React, { useState } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, StackDivider, Icon, Textarea } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Flex,
    Heading,
    Stack,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { FaGithub, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { ChevronLeftIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';
import { Cards } from './Cards';

const Board = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isCardModalOpen, setCardModalOpen] = useState(false);
    const [cardlistID, setCardListID] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    // Access the boards using location
    const boardId = location.state;
    console.log(boardId.ID); // THIS IS THE BOARD ID FOR API PURPOSES (parent_id is user_id)

    const [displayCardlists, setDisplayCardlists] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
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

    //make new card
    const handleCreateCard = async () => {
        var parts = cardlistID.split('_');
        var ID = parts[1];
        try {
            const response = await fetch('http://localhost:8000/boardly/card/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    
                    id: "",
                    title: formData.title,
                    description: formData.description,
                    parent_id: ID,
                    order: 0
                      
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const newCard = await response.json();
    
            setDisplayCardlists(prevState => {
                const updatedCardlists = [...prevState];
                updatedCardlists[0].cards.push(newCard); // Assuming the first cardlist
                return updatedCardlists;
            });
        } catch (error) {
            console.error('Error creating card:', error);
        }
    
        setCardModalOpen(false);
        window.location.reload()
    };

    

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

    const handleDeleteCardList = async (cardListID) => {
        // need to figure out how to get cardID from the card
        // console.log(cardID);
        var parts = cardListID.split('_');
        cardListID = parts[1];
        try {
            const response = await fetch(`http://localhost:8000/boardly/cardlist/delete?id=${cardListID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Card list deleted successfully:', data);
            handleShowCardlists(); // Refresh cards after deletion
        } catch (error) {
            console.error('Error deleting card list:', error);
        }
    };



    return (
        <Flex className="board-container" bgGradient='linear(to-tl, #211938, #271c4d )' >
            <div className="App-header">
                <TopBar />
            </div>
            <HStack className="board-header" justifyContent="space-between" alignItems="center">
                <Button className="my-20 mx-5 text-white" bg='transparent' _hover={{ color: theme.colors.brand.mauve, bg: theme.colors.transparent }} onClick={handleNavigateDashboard}>
                    <Icon as={ChevronLeftIcon} w={6} h={6} color="white" _hover={{ color: theme.colors.brand.mauve, bg: theme.colors.transparent }} 
                    />
                </Button>
                <Button className='' onClick={() => onOpen()}
                    bg={isOpen ? theme.colors.brand.ultraviolet : theme.colors.brand.semiprimary}
                    color={isOpen ? 'white' : 'white'}
                    borderColor={isOpen ? theme.colors.brand.spacecadet : 'initial'}
                    _hover={{
                        bg: theme.colors.brand.ultraviolet,
                        color: theme.colors.brand.mauve,
                        borderColor: theme.colors.brand.spacecadet,
                    }}>
                    Create Cardlist
                    <AddIcon className='ml-2' boxSize={3} />
                </Button>
            </HStack>
            <Flex className="board-content px-10">
            <HStack spacing="4" align="stretch" flexWrap="wrap" justifyContent="center" alignItems="center">
                  {displayCardlists.map((board, boardIndex) => (
                      <Flex position="relative" w="300px">
                      <Box
                        className='cursor-pointer text-white py-2'
                        w="300px"
                        h="auto"
                        bg={theme.colors.brand.menubutton}
                        boxShadow="0 0 20px rgba(0, 0, 0, 0.3)"
                        borderRadius="md"
                        _hover={{ bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve }}
                        _active={{ bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet }}
                      >
                        <Heading size='sm'>{board.title}</Heading>
                        {/* Render cards within the card list */}
                        <Cards myCardList={board.id}></Cards>
                        {/* Button to add a new card */}
                        <Button onClick={() => { setCardModalOpen(true); setCardListID(board.id) }}>Add Card</Button>
                      </Box>
                      <Icon as={CloseIcon} position="absolute" right="2" top="2" w={3} h={3} color="white" _hover={{ color: 'red', transform: 'scale(1.2)' }} onClick={()=>handleDeleteCardList(board.id)}/>
                    </Flex>
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
            <Modal blockScrollOnMount={false} isOpen={isCardModalOpen} onClose={() => setCardModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Card</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight='bold' mb='1rem'>
                            Card Title
                        </Text>
                        <Input name="title" placeholder="Enter card title" value={formData.title} onChange={handleChange} required />
                        <Text fontWeight='bold' mt='1rem' mb='1rem'>
                            Card Description
                        </Text>
                        <Textarea name="description" placeholder="Enter card description" value={formData.description} onChange={handleChange} required />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='purple' mr={3} onClick={() => setCardModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button colorScheme='green' onClick={() => handleCreateCard(cardlistID)}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};
export default Board;