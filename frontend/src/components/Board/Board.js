import React, { useState } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, StackDivider, Icon, Textarea, Select } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';
import { useNavigate, useLocation } from 'react-router-dom';
import SuggestionsPanel from './SuggestionsPanel'; 
import {
    Flex,
    Heading,
    Stack,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { FaGithub, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { ChevronLeftIcon, AddIcon, CloseIcon, EditIcon, CheckIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';
import { Cards } from './Cards';

const Board = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isCardModalOpen, setCardModalOpen] = useState(false);
    const [cardlistID, setCardListID] = useState('');
    const [editingCardlistId, setEditingCardlistId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
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
    const [users, setUsers] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        console.log('Description:', value); // Add this line to log the description
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

    const handleEditTitle = async (cardListID, newTitle) => {
        var fieldName = 'title';
        try {
            const response = await fetch(`http://localhost:8000/boardly/card/update/field?card_id=${cardListID}&field_name=${fieldName}&new_value=${newTitle}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Cardlist title updated successfully:', data);
            handleShowCardlists(); // Refresh cards after updating title
            setEditingCardlistId(null); // Exit edit mode
            setEditingTitle(''); // Reset editing title
        } catch (error) {
            console.error('Error updating cardlist title:', error);
        }
    };

    const getAllUsers = async () => {
        // hit endpoint at http://localhost:8000/boardly/user/get/all
        // return all users in such a way that they can be displayed in the dropdown
        try {
            const response = await fetch('http://localhost:8000/boardly/user/get/all');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            return data;
        }
        catch (error) {
            console.error('Error getting all users:', error);
        }
    };

    useEffect(() => {
        getAllUsers().then((data) => {
            setUsers(data);
        });
    }, []);

    const handleInvite = async (e) => {
        console.log("Selected user:", selectedUser.trim(), "invited to board:", boardId.ID);
    
        // Construct the query parameters
        const queryParams = new URLSearchParams({
            user_id: selectedUser.trim(),
            board_id: boardId.ID,
        });
    
        try {
            const response = await fetch(`http://localhost:8000/boardly/board/invite?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Note: You may not need to send a body if the API only expects query parameters
            });
    
            if (!response.ok) {
                const errorBody = await response.json();
                console.error('Server-side validation errors:', errorBody);
                throw new Error(`Server responded with status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('User invited successfully:', data);
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };

    return (
        <Flex className="board-container" bgGradient='linear(to-tl, #211938, #271c4d )' >
            <div className="App-header">
                <TopBar />
            </div>
            <Flex className="board-main">
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
                                className='text-white py-2'
                                w="300px"
                                h="auto"
                                bg={theme.colors.brand.menubutton}
                                boxShadow="0 0 20px rgba(0, 0, 0, 0.3)"
                                borderRadius="md"
                            >
                                <Flex direction="row" alignItems="center" paddingLeft={'4.5vw'}>
                                {editingCardlistId !== board.id ? (
                                    <>
                                        <Text fontSize={'xl'} color={'white'} mr={2}>{board.title}</Text>
                                        <Icon as={EditIcon} w={3} h={3} color={'gray'} _hover={{color: 'green', transform: 'scale(1.2)'}}
                                            onClick={() => { setEditingCardlistId(board.id); setEditingTitle(board.title); }} />
                                    </>
                                ) : (
                                    <>
                                        <Flex>
                                        <Input
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            size="sm"
                                            autoFocus
                                            onBlur={() => handleEditTitle(board.id, editingTitle)}
                                            onKeyDown={(e) => { if(e.key === 'Enter') { handleEditTitle(board.id, editingTitle); }}}
                                        />
                                        <Icon ml={4} mt={2} as={CheckIcon} w={3} h={3} color={'green'} _hover={{color: 'blue', transform: 'scale(1.2)'}}
                                            onClick={() => handleEditTitle(board.id, editingTitle)} />
                                        </Flex>
                                    </>
                                )}
                            </Flex>
                                {/* Render cards within the card list */}
                                <Cards myCardList={board.id} description={formData.description}></Cards>
                                {/* Button to add a new card */}
                                <Button onClick={() => { setCardModalOpen(true); setCardListID(board.id) }}>Add Card</Button>
                            </Box>
                            <Icon as={CloseIcon} position="absolute" right="2" top="2" w={3} h={3} color="white" _hover={{ color: 'red', transform: 'scale(1.2)' }} onClick={()=>handleDeleteCardList(board.id)}/>
                            </Flex>
                        ))}
                    </HStack>
                </Flex>
                <Flex justifyContent="flex-end" width="100%" position="absolute" right="0" top="-2" zIndex={'200'}>
                    <Button mt="20px" mr="20px" onClick={() => setInviteModalOpen(true)}>Invite User</Button>
                </Flex>

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
            <Modal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Invite User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Select
                        placeholder="Select user ID"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        >
                        {users.map((email, index) => (
                            <option key={index} value={email}>{email}</option>
                        ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                    <Button colorScheme='purple' mr={3} onClick={() => setInviteModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button colorScheme='green' onClick={() => handleInvite()}>
                        Invite
                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};
export default Board;