import { useState } from 'react'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;