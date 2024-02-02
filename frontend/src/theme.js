import { extendTheme } from '@chakra-ui/react';
import { MenuTheme } from '@chakra-ui/menu';

export const customTheme = extendTheme({
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      gray: {
        50: '#f7fafc',
        // ...
        900: '#171923',
      },
      red: {
        50: '#fff5f5',
        900: '#610404',
      },
      // ...
    },
});

