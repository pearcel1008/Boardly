import React, { useState, useEffect } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [displayBoards, setDisplayBoards] = useState([]);
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
    console.log("Clicked board id:", boardId);
  };  

  useEffect(() => {
    handleShowBoard(); // Fetch data when component mounts
  }, []);

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
        {displayBoards.map((board, index) => (
          <Box key={index} borderWidth="1px" borderRadius="lg" p={4} m={2} onClick={() => handleBoardClick(board.id)}>
            <Link fontWeight="bold">{board.title}</Link>
          </Box>
        ))}
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
            <Button colorScheme='green' onClick={handleCreateBoard}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </div>
  );
}

export default Dashboard;
