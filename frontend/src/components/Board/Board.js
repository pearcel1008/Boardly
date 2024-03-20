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
    import { ChevronLeftIcon } from '@chakra-ui/icons';


const Board = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    // Access the boards using location
    const boardId = location.state;
    console.log(boardId.ID); // THIS IS THE BOARD ID FOR API PURPOSES (parent_id is user_id)

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
            <Button className="my-20 mx-5 text-white" bg='transparent' _hover={{color: theme.colors.brand.mauve, bg: theme.colors.transparent}} onClick={handleNavigateDashboard}>
                <Icon as={ChevronLeftIcon} w={6} h={6} color="white" _hover={{color: theme.colors.brand.mauve, bg: theme.colors.transparent}} 
                 />
            </Button>
            <Flex className="board-content px-10">
                <HStack spacing="4" align="stretch" flexWrap="wrap" justifyContent="center" alignItems="center">
                <Box  className='cursor-pointer  text-white py-2'
                        w="300px"
                        h="100px"
                        bg={theme.colors.brand.menubutton}
                        boxShadow="0 0 20px rgba(0, 0, 0, 0.3)"
                        borderRadius="md"
                        _hover={{bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve}}
                        _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}
                    >
                    <Heading size='sm'>Cardlist 1</Heading>
                </Box>
                <Box  className='cursor-pointer  text-white py-2'
                        w="300px"
                        h="100px"
                        bg={theme.colors.brand.menubutton}
                        boxShadow="0 0 20px rgba(0, 0, 0, 0.3)"
                        borderRadius="md"
                        _hover={{bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve}}
                        _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}
                    >
                    <Heading size='sm'>Cardlist 2</Heading>
                </Box>
                </HStack>
        </Flex>
        </Flex>
    );
};
export default Board;