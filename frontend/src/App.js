import './App.css';
import Topbar from './components/topbar/Topbar.js';
import Logo from './components/topbar/Logo.js';
import { extendTheme, ChakraProvider, Container } from '@chakra-ui/react'

function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Button
    </button>
  );
}

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <Topbar />
          
        </header>
        <Container>
        </Container>
      </div>
  );
}

export default App;
