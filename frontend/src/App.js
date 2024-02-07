import './App.css';
import Topbar from './components/topbar/Topbar.js';
import Logo from './components/topbar/Logo.js';
import { extendTheme, ChakraProvider, Container } from '@chakra-ui/react'
import { AuthProvider } from './AuthContext.js';

function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Button
    </button>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null); // null: not attempted, true: success, false: failure

  const handleLogin = async () => {
    try {
      // Make a POST request to your login endpoint with email and password as query parameters
      const response = await fetch(`http://127.0.0.1:8000/boardly/login?email=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Login successful');
        setLoginStatus(true);
        // Handle successful login, e.g., redirect to a new page
      } else {
        console.error('Login failed');
        setLoginStatus(false);
        // Handle failed login, show an error message, etc.
      }
    } catch (error) {
      console.error('Login failed', error);
      setLoginStatus(false);
    }
  };

  const handleLoginGitHub = () => {
    const githubAuthorizeUrl = 'http://localhost:8000/google/login';
    window.location.href = githubAuthorizeUrl;
  };

  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Topbar />
          
        </header>
        <Container>
        </Container>
      </div>
    </AuthProvider>
  );
}

export default App;