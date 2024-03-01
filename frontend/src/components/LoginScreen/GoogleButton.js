// GoogleButton.js

import React from 'react';
import { Button } from '@chakra-ui/react'; // Import Button from Chakra UI
import { FaGoogle } from 'react-icons/fa'; // Import Google icon

const GoogleButton = () => {
  const handleGoogleLogin = () => {
    // Redirect the user to the Google authentication endpoint
    window.location.href = '/login';
  };

  return (
    <Button
      leftIcon={<FaGoogle />}
      colorScheme="red" // You can choose any color scheme here
      variant="solid" // You can use "outline" or other variants if you prefer
      onClick={handleGoogleLogin} // Set onClick event handler
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleButton;
