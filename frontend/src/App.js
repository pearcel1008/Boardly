import './App.css';
import Topbar from './components/topbar/Topbar.js';
import Logo from './components/topbar/Logo.js';
import { ChakraProvider, Container } from '@chakra-ui/react'
import { AuthProvider } from './AuthContext.js';
import Home from './components/LoginScreen/Home.js'; // Import the Home component

function App() {
  return (
    <AuthProvider>
      <ChakraProvider>
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
