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
    IconButton,
    Text
  } from '@chakra-ui/react'
import './ProfileMenu.css';
import { useTheme } from '@emotion/react';

import { useAuth } from '../../AuthContext.js';
import LogoutModal from '../logoutmodal/LogoutModal';
import { HamburgerIcon } from '@chakra-ui/icons';

function ProfileMenu() {
    const theme = useTheme();
    const { loggedIn } = useAuth();
    return (
        <Menu bg={theme.colors.brand.menubutton}>
        <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            color={'white'}
            bg={theme.colors.brand.menubutton}
            borderColor={theme.colors.brand.spacecadet}
            _hover={{bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve, borderColor: theme.colors.brand.ultraviolet}}
            _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}
        />
        <MenuList className="drop-shadow-2xl" 
        bg={theme.colors.brand.menubutton} 
        borderColor={theme.colors.brand.menubutton}>
            <MenuItem 
            bg={theme.colors.brand.menubutton}
            _hover={{bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve, borderColor: theme.colors.brand.ultraviolet}}
            _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}>
                <Text  size='md'>Profile</Text>
            </MenuItem>
            <MenuItem 
            bg={theme.colors.brand.menubutton}
            _hover={{bg: theme.colors.brand.ultraviolet, color: theme.colors.brand.mauve, borderColor: theme.colors.brand.ultraviolet}}
            _active={{bg: theme.colors.brand.ultraviolet, color: 'white', borderColor: theme.colors.brand.ultraviolet}}>
                <Text size='md'>Settings</Text>
            </MenuItem>
            <MenuDivider />
            <LogoutModal /> 
            
        </MenuList>
        </Menu>
    )
}
    
export default ProfileMenu;