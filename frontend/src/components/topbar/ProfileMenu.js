import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'
import ProfilePic from './ProfilePic.js';
import './ProfileMenu.css';
import { useTheme } from '@emotion/react';


function ProfileMenu() {
    const theme = useTheme();
    return (
        <Menu>
        <MenuButton >
            <ProfilePic />
        </MenuButton>
        <MenuList>
            <MenuItem className='link' color='red.50'>My Account</MenuItem>
            <MenuItem className='link'>Payments </MenuItem>
        </MenuList>
        </Menu>
    )
}
    
export default ProfileMenu;