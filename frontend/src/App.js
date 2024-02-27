import './App.css';
import Topbar from './components/topbar/Topbar.js';
import Logo from './components/topbar/Logo.js';
import { ChakraProvider, Container } from '@chakra-ui/react'
import { AuthProvider } from './AuthContext.js';
import Home from './components/LoginScreen/Home.js'; // Import the Home component
import {customTheme as theme} from './theme.js';

function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <div className="App">
          <header className="App-header">
            <Topbar />
            <Home />
          </header>
          <Container>
         
          </Container>
           
          
        </div>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
