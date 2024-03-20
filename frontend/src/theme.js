import { extendTheme } from '@chakra-ui/react';

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
      blue:{
        50:  '87EAFF',
        500: '2d9de3',
      },
      brand: {
        mauve: '#d1b9ff',
        ultraviolet: '#62587c',
        spacecadet: '#3d325d',
        vacuum: '#24263a',
        topbar: '#4d4560',
        oxford: '#211938',
        nonphoto: '#87eaff',
        vividsky: '#47ddff',
        cerulean: '#00758f',
        jasmine: '#ffe785',
        mustard: '#ffd93f',
        primary: '#a688fa',
        primaryhover: '#ba9ffb',
        menubutton: '#372e4c',
        semiprimary: '#5a4a83 '
      },
    },
});

