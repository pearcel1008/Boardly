import logo from '../../logo.svg';
import './Topbar.css';
import { extendTheme, ChakraProvider, Flex, Spacer, Box, Center, Text} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import Logo from './Logo.js';
import ProfileMenu from './ProfileMenu.js';

function Topbar() {
  return (
    <Flex className="w-full h-16 fixed top-0 left-0 bg-[#62587c] z-50" align="center">
      <Box p="2" className="flex-grow-0">
        <Flex align="center"> {/* This ensures vertical center alignment */}
          <Logo className='h-full w-auto'/>
          {/* Ensure Text component inherits Flex alignment; removed 'items-center' as it's not a valid prop here */}
          <Text color="white" ml={2} fontFamily="Berkeley Mono" fontSize={'xl'}>Boardly</Text>
        </Flex>
      </Box>
      <Spacer />
      <Box p="2">
        <Center className="h-full cursor-pointer"><ProfileMenu /></Center>
      </Box>
    </Flex>
  );
}

export default Topbar;