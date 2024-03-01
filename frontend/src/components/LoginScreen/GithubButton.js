import React from "react";
import { Button } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const GithubButton = () => {
  return (
    <Button
      leftIcon={<FaGithub />}
      colorScheme="gray" // You can choose any color scheme here
      variant="solid" // You can use "outline" or other variants if you prefer
    >
      Sign in with GitHub
    </Button>
  );
};

export default GithubButton;
