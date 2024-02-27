import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Avatar,
    useBreakpointValue,

  } from '@chakra-ui/react'
import './ProfileMenu.css';
import { useTheme } from '@emotion/react';

import { useAuth } from '../../AuthContext.js';
import LogoutModal from '../logoutmodal/LogoutModal';


function ProfileMenu() {
    const theme = useTheme();
    const { loggedIn } = useAuth();
    return (
        <Menu>
        <MenuButton >
            {loggedIn ? (
            <Avatar size={{base: 'sm', md: 'md', lg: 'lg'}} name='Jeremy Martin' src='https://bit.ly/3Uuox37'/>
            ) : (
            <Avatar size={{base: 'sm', md: 'md', lg: 'lg'}}  bg={'blue.300'}/>
            )}
        </MenuButton>
        <MenuList>
            <MenuItem color={'blue.500'}>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuDivider />
            <LogoutModal /> 
            
        </MenuList>
        </Menu>
    )
}
    
export default ProfileMenu;