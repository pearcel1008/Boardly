import './App.css';
import Topbar from './components/topbar/Topbar.js';
import Logo from './components/topbar/Logo.js';
import { ChakraProvider, Container } from '@chakra-ui/react'
import { AuthProvider } from './AuthContext.js';
import Home from './components/LoginScreen/Home.js'; // Import the Home component
import {customTheme as theme} from './theme.js';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import SignUpForm from './components/LoginScreen/SignUp/Signup';
import Dashboard from './components/Dashboard/Dashboard'
import Board from './components/Board/Board'
function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <div className="App">
            <Routes>
              <Route path="/" exact element={<><header className="App-header"><Topbar/><Home/></header></>} /> {/* Home page route */}
              <Route path="/signup" exact element={<><SignUpForm /></>} /> {/* Signup page route */}
              <Route path="/dashboard" exact element={<><Dashboard /></>} /> {/* Dashboard page route */} 
              <Route path="/board1" exact element={<><Board /></>} /> {/* Board page route */}
            </Routes>
          <Container>
          </Container>
        </div>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;