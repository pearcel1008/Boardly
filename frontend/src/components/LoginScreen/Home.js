import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';

const Home = () => {
  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <form style={{ width: '100%', textAlign: 'center' }}>
        <Box mb={8}>
          <Heading>Login or Sign Up</Heading>
        </Box>
        <Stack spacing={4} width="300px" margin="0 auto">
          <Input
            placeholder="Email"
            variant="filled"
            size="lg"
            type="email"
          />
          <Input
            placeholder="Password"
            variant="filled"
            size="lg"
            type="password"
          />
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
          >
            Login
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            size="lg"
            width="full"
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </Flex>
  );
};

export default Home;
