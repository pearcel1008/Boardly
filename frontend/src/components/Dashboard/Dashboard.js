import React, { useState, useEffect } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, Flex, bgGradient, Center, Heading, Icon } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { AddIcon, CloseIcon, EditIcon, CheckIcon } from '@chakra-ui/icons';

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [displayBoards, setDisplayBoards] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
  });
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateBoard = async (e) => {
    var currentURL = window.location.href;
    var parts = currentURL.split('=');
    var userID = parts[1];
    console.log(userID);
    console.log(formData.title)
    //Create user
    try {
      const response = await fetch('http://localhost:8000/boardly/board/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: '',
          title: formData.title,
          starred: false,
          parent_id: userID,
          cardlists: [],
          members: []
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
    handleShowBoard();
    onClose();
  };

  const handleShowBoard = async (e) => {
    var currentURL = window.location.href;
    var parts = currentURL.split('=');
    const userID = parts[1];
    console.log(userID);
    console.log(formData.title);
    //Create user
    try {
      const userData = await fetch(`http://localhost:8000/boardly/user/get?id=${userID}`);
      
      if (!userData.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await userData.json();
      const boards = [];
      for(var i = 0; i < data.board_member.length; i++){
        const userBoards = await fetch(`http://localhost:8000/boardly/board/get?id=${data.board_member[i]}`);
        if (!userBoards.ok) {
          throw new Error('Network response was not ok');
        }
        const userBoardsData = await userBoards.json();
        boards.push({ id: userBoardsData.id, title: userBoardsData.title})
      }
      setDisplayBoards(boards);
      console.log('Board showed successfully:', data);

    } catch (error) {
      console.error('Error showing board:', error);
    }
  };

  const handleBoardClick = (boardId) => {
    // Go into card logic
    var parts = boardId.split('_');
    const ID = parts[1];
    console.log(ID);
    console.log("Clicked board id:", ID);
    navigate(`/board?board_id=${ID}`, { state: { ID } });
  }; 
  
  const handleDeleteBoard = async (boardID) => {
    
    var parts = boardID.split('_');
    boardID = parts[1];
    try {
      const response = await fetch(`http://localhost:8000/boardly/board/delete?id=${boardID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Board deleted successfully:', data);
      handleShowBoard(); // Refresh cards after deletion
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleEditTitle = async (cardID, newTitle) => {
    var fieldName = 'title';
    try {
        const response = await fetch(`http://localhost:8000/boardly/board/update/field?card_id=${cardID}&field_name=${fieldName}&new_value=${newTitle}`, {
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
        console.log('Board title updated successfully:', data);
        handleShowBoard(); // Refresh cards after updating title
        setEditingBoardId(null); // Exit edit mode
        setEditingTitle(''); // Reset editing title
    } catch (error) {
        console.error('Error updating board title:', error);
    }
};

  useEffect(() => {
    handleShowBoard(); // Fetch data when component mounts
  }, []);

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
        {displayBoards.map((board, index) => (
          <Flex position="relative" w="300px" h="100px">
          <Box
            key={index}
            className='cursor-pointer text-white py-2'
            w="300px"
            h="100px"
            bg={theme.colors.brand.menubutton}
            boxShadow="0 0 20px rgba(0, 0, 0, 0.3)"
            borderRadius="md"
            _hover={{ bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve }}
            _active={{ bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet }}
            onClick={() => handleBoardClick(board.id)}
          >
            <Flex direction="row" alignItems="center" paddingLeft={'4.5vw'}>
                        {editingBoardId !== board.id ? (
                            <>
                                <Text fontSize={'xl'} color={'white'} mr={2}>{board.title}</Text>
                                <Icon as={EditIcon} w={3} h={3} color={'gray'} _hover={{color: 'green', transform: 'scale(1.2)'}}
                                    onClick={() => { setEditingBoardId(board.id); setEditingTitle(board.title); }} />
                            </>
                        ) : (
                            <>
                                <Input
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    size="sm"
                                    autoFocus
                                    onBlur={() => handleEditTitle(board.id, editingTitle)}
                                    onKeyDown={(e) => { if(e.key === 'Enter') { handleEditTitle(board.id, editingTitle); }}}
                                />
                                <Icon as={CheckIcon} w={3} h={3} color={'green'} _hover={{color: 'blue', transform: 'scale(1.2)'}}
                                    onClick={() => handleEditTitle(board.id, editingTitle)} />
                            </>
                        )}
                    </Flex>
          </Box>
          <Icon 
            as={CloseIcon} 
            position="absolute" 
            right="2" 
            top="2" 
            w={3} 
            h={3} 
            color="white" 
            _hover={{ color: 'red', transform: 'scale(1.2)' }} 
            onClick={() => handleDeleteBoard(board.id)}
          />
        </Flex>
        
        ))}
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
            <Button colorScheme='green' onClick={handleCreateBoard}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </Flex>
  );
}

export default Dashboard;
