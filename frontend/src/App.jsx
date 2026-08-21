import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar'
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Predict from './pages/Predict';
import Leaderboard from './pages/Leaderboard';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login';

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {isPublicRoute ? (
        /*Public layout - no sidebar */
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            {/* If logged in user visits /login, send them to dashboard */}
            {user && <Route path="/login" element={<Navigate to="/dashboard" replace />} />}
          </Routes>
        </div>
      ) : (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          {/* Only show Sidebar if user is logged in */}
          {user && (
            <Sidebar 
              isCollapsed={isCollapsed} 
              setIsCollapsed={setIsCollapsed} 
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          )}
          <div className={`main-content ${isCollapsed ? 'expanded' : ''}`} style={{ width: '100%', overflowY: 'auto', height: '100vh' }}>
            <Routes>
              <Route path="/dashboard" element={
                <ProtectedRoute user={user}>
                  <Home user={user} setUser={setUser} />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute user={user}>
                  <Leaderboard user={user} setUser={setUser}/>
                </ProtectedRoute>
              } />
              <Route path="/predict/:eventId" element={
                <ProtectedRoute user={user}>
                  <Predict />
                </ProtectedRoute>
              } />
              {/* If user isn't logged in and tries to access dashboard, they get redirected */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;