import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Divider
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../topbar/Topbar';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

  const handleSubmit = async (e) => {
    // form submission logic
    console.log(formData);

    //Create user
    try {
      console.log(formData);
      const userId = formData.firstName + "_" + formData.lastName;
      const dateRegistered = new Date().toISOString().split('T')[0];
      const response = await fetch('http://localhost:8000/boardly/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: formData.email,
          username: userId,
          email: formData.email,
          password: formData.password,
          date_registered: dateRegistered,
          board_member: []
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('User created successfully:', data);
      // Reset form fields after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const theme = useTheme();
  const navigate = useNavigate();
  console.log("theme is about to be logged");
  console.log(theme.colors);

  return (
    <Flex className="signup-container" minHeight="100vh" width="full" align="center" justifyContent="center" bg={theme.colors.brand.oxford}>
      <div className="App-header">
        <Topbar />
      </div>
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center" bg={theme.colors.brand.oxford}>
      <Stack spacing={4} width="300px" margin="0 auto">
        <Box mb={8}>
          <Heading color="white">First time?</Heading>
        </Box>
          <Input
            placeholder="First Name"
            variant="filled"
            size="lg"
            type="text"
            name="firstName"
            value={formData.firstName} 
            onChange={handleChange} required
            _focus={{bg: 'gray.200'}}
            color='gray.600'
          />
          <Input
            placeholder="Last Name"
            variant="filled"
            size="lg"
            type="text"
            name="lastName"
            value={formData.lastName} 
            onChange={handleChange} required
            _focus={{bg: 'gray.200'}}
            color='gray.600'
          />
          <Input
            placeholder="Email"
            variant="filled"
            size="lg"
            type="text"
            name="email"
            value={formData.email} 
            onChange={handleChange} required
            _focus={{bg: 'gray.200'}}
            color='gray.600'
          />
          <Input
            placeholder="Password"
            variant="filled"
            size="lg"
            type="password"
            name="password"
            value={formData.password} 
            onChange={handleChange} required
            _focus={{bg: 'gray.200'}}
            color='gray.600'
          />
          <Button
            bg={theme.colors.brand.primary}
            color={theme.colors.brand.vacuum}
            type="submit"
            size="lg"
            width="full"
            onClick={() => {
              handleSubmit();
              navigate("/")
            }}
            _hover={{bg: theme.colors.brand.primaryhover, color: theme.colors.brand.vacuum}}
          >
            Sign Up
          </Button>
          <Divider />
          <Flex justifyContent="center" color={theme.colors.brand.primary}>
              Having issues? Don't worry, we have no support team.
          </Flex>
        </Stack>
    </Flex>
    </Flex>
  );
};

export default SignUpForm;