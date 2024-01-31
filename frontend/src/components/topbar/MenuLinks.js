import { extendTheme, ChakraProvider, Stack } from '@chakra-ui/react'
// import { Link } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'

function MenuLinks() {
  return (
    <ChakraProvider>
        <Breadcrumb>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink className='links'>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#' className='links'>About</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
          <BreadcrumbLink href='#' className='links'>Login</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
    </ChakraProvider>
  );
}

export default MenuLinks;