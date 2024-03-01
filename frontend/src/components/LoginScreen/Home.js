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
import { useTheme } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle } from "react-icons/fa";
import GoogleButton from './GoogleButton';
import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script';

/*TODO: PUT GITHUB/GOOGLE LOGIN BUTTONS BETWEEN LOGIN BUTTON AND DIVIDER */
const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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
            {/* GitHub and Google login buttons */}
  <Button
  variant="outline"
  borderColor={theme.colors.brand.spacecadet}
    leftIcon={<FaGithub />}
    bg={theme.colors.brand.oxford}
    color={theme.colors.brand.mauve}
    size="lg"
    width="full"

    onClick={handleLoginGitHub}>
  
    Sign in with GitHub
  </Button>
  <Button
  variant="outline"
  borderColor={theme.colors.brand.spacecadet}
    leftIcon={<FaGoogle />}
    bg={theme.colors.brand.oxford}
    color={theme.colors.brand.mauve}
    size="lg"
    width="full"
    
    onClick={handleGoogleLogin}
  >
    Sign in with Google
  </Button>
  {/* Sign up button */}
          <Text fontSize={'xs'} color={theme.colors.brand.mauve} >Don't have an account?</Text>
            <Button
              variant="outline"
                
              color={theme.colors.brand.mauve}
              borderColor={theme.colors.brand.spacecadet}
              size="lg"
              width="full"
              onClick={() => {
                navigate("/signup")
              }}
            >
              Sign Up
            </Button>
        </Stack>

        
      </form>
    </Flex>
  );
};
const handleGoogleLogin = () => {
  // Redirect the user to the Google authentication endpoint
  const googleAuthUrl = 'http://localhost:8000/google/login';
  
  window.location.href = googleAuthUrl;

};

const handleLoginGitHub = () => {
  const githubAuthorizeUrl = 'https://github.com/login/oauth/authorize?client_id=56248e47f60d52542c9a&redirect_uri=http://localhost:8000/boardly/login/callback&scope=read:user';
  window.location.href = githubAuthorizeUrl;
};


export default Home;