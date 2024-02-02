import logo from '../../logo.svg';
import './Topbar.css';
import { extendTheme, ChakraProvider, Flex, Spacer, Box, Center} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import Logo from './Logo.js';
import ProfileMenu from './ProfileMenu.js';

function Topbar() {
  return (
    <ChakraProvider>
      <div className='topbar'>
        <Flex>
          <Box p="2">
            <Center h='5.8vh' style={{paddingBottom: '1vh'}}><Logo /></Center>
            
          </Box>
          <Spacer />
          <Box p="2">
            <Center h='5.8vh' style={{paddingBottom: '1vh'}} ><ProfileMenu /></Center>
          </Box>
        </Flex>

      </div>
    </ChakraProvider>
  );
}

export default Topbar;