import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar'
import Home from './pages/Home';
import Login from './pages/Login';
import Predict from './pages/Predict';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';
import './App.css'

function App() {
  // State management
  const [user, setUser] = useState(null);

  // Checks if user was saved in browser's storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Only runs once when app starts

  // States of the sidebar and their functions
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // Enables navigation between pages without reloading
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
          {/*Shows this component when user visits URL*/}
          <Routes>
            <Route path="/" element={<Home user={user} setUser={setUser} />} />
            <Route path="/leaderboard" element={<Leaderboard user={user} setUser={setUser}/>} />
            <Route path="/login" element={<Login setUser={setUser} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;