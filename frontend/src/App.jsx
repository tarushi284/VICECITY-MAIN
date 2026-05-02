import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Traffic from './pages/Traffic';
import Weather from './pages/Weather';
import Reports from './pages/Reports';
import News from './pages/News';
import Attractions from './pages/Attractions';
import Events from './pages/Events';
import Contacts from './pages/Contacts';
import Chat from './pages/Chat';
import Search from './pages/Search';
import Payment from './pages/Payment';
import Chatbot from './components/Chatbot';
import GlobalCursor from './components/GlobalCursor';
import AuthLayout from './components/AuthLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <GlobalCursor />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth Routes with Persistent Particles */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/traffic" element={<Traffic />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/news" element={<News />} />
            <Route path="/attractions" element={<Attractions />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/search" element={<Search />} />
            <Route path="/payment/:eventId" element={<Payment />} />
          </Routes>
          <Chatbot />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
