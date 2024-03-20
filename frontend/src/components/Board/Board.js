import React, { useState } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, StackDivider, Icon } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar';
import { useNavigate } from 'react-router-dom';
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
    return (
        <Flex className="board-container" bgGradient='linear(to-tl, #211938, #271c4d )' >
            <div className="App-header">
                <TopBar />
            </div>
            <Button className="my-20 mx-5 text-white" onClick={() => navigate('/dashboard')} bg='transparent' _hover={{color: theme.colors.brand.mauve, bg: theme.colors.transparent}}>
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