import './App.css';
import Topbar from './components/topbar/Topbar.js';
import Logo from './components/topbar/Logo.js';
import { ChakraProvider, Container } from '@chakra-ui/react'
import { AuthProvider } from './AuthContext.js';
import Home from './components/LoginScreen/Home.js'; // Import the Home component
import {customTheme as theme} from './theme.js';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import SignUpForm from './src/components/LoginScreen/SignUp/Signup';
function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <div className="App">
          <header className="App-header">
            <Topbar />
            <Home />
            <Router>
      <Routes>
        <Route path="/" exact component={Home} /> {/* Home page route */}
        <Route path="/signup" component={SignUpForm} /> {/* Signup page route */}
      </Routes>
    </Router>
          </header>
          <Container>
         
          </Container>
           
          
        </div>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
