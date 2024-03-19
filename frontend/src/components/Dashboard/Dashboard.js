
import React from 'react';
import { Box, VStack, HStack, Text, Divider, Link } from '@chakra-ui/react';
import TopBar from '../topbar/Topbar'
import { useTheme, Flex } from '@chakra-ui/react';

const Dashboard = () => {
  const theme = useTheme();
    return (
      <div className="dashboard-container">
        <div className="App-header">
          <TopBar></TopBar>
        </div>
          <div className="dashboard-sidebar">
          <VStack spacing="4" align="stretch">
            <Text fontSize="lg" fontWeight="bold">
              Dashboard
            </Text>
            <Divider />
            <Link>Boards</Link>
            <Link>Create</Link>
            <Divider/>
            <Link>Archives</Link>
          </VStack>
          </div>
          <div className="dashboard-content">
            <HStack spacing="4" align="stretch" flexWrap="wrap" justifyContent="center" alignItems="center">
              <Box  w="300px" // Width
                    h="100px" // Height
                    bg="white" // Background color
                    boxShadow="0 0 20px rgba(0, 0, 0, 0.2)"
                    borderRadius="md" // Border radius
                >
                Board 1
              </Box>
            </HStack>
          </div>
      </div>
    );
  };
  
  export default Dashboard;