import React, { useState } from 'react';
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

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const { email, password } = formData; // Destructure email and password from formData

    try {
      console.log(formData);

      const response = await fetch(`http://127.0.0.1:8000/boardly/login?email=${email}&password=${password}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('User logged in successfully:', data);

      // Reset form fields after successful login
      setFormData({
        email: '',
        password: ''
      });

//direct to dashboard page if successful(?) 
      window.location.href = '/dashboard'; 
      // Handle any further actions after successful login, such as redirecting to another page
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error, for example, displaying an error message to the user
    }
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
            value={formData.email}
            onChange={handleChange}
            name="email"
          />
          <Input
            placeholder="Password"
            variant="filled"
            size="lg"
            type="password"
            value={formData.password}
            onChange={handleChange}
            name="password"
          />
          <Button
            bg={theme.colors.brand.vacuum}
            color={theme.colors.brand.mauve}
            type="submit"
            size="lg"
            width="full"
            onClick={handleLogin}
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
            onClick={handleLoginGitHub}
          >
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
}
export default Home;
