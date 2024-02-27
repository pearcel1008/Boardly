import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Divider,
  Text
} from '@chakra-ui/react';
import { useTheme, defineStyle, defineStyleConfig } from '@chakra-ui/react';
/*TODO: PUT GITHUB/GOOGLE LOGIN BUTTONS BETWEEN LOGIN BUTTON AND DIVIDER */
const Home = () => {
  const theme = useTheme();
  console.log("theme is about to be logged");
  console.log(theme.colors);
  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center" bg={theme.colors.brand.oxford}>
      <form style={{ width: '100%', textAlign: 'center' }}>
        <Box mb={8}>
          <Heading>Login</Heading>
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
            bg={theme.colors.brand.vacuum}
            color={theme.colors.brand.mauve}
            
            type="submit"
            size="lg"
            width="full"
          >
            Login
          </Button>
          <Divider />
          <Text fontSize={'xs'} color={theme.colors.brand.mauve} >Don't have an account?</Text>
          <Button
            variant="outline"
            
            color={theme.colors.brand.mauve}
            borderColor={theme.colors.brand.spacecadet}
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
