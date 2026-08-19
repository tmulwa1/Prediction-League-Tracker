import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isCollapsed, setIsCollapsed, isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to handle link clicks on mobile
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay (Click to close sidebar on mobile) */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isSidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="sidebar-brand" onClick={handleLinkClick}>
          <span style={{ fontSize: '1.5rem' }}>🏆</span>
          <span>Prediction League</span>
        </Link>

        <div className="sidebar-nav">
          <Link to="/" className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`} onClick={handleLinkClick}>
            <span className="icon">🏠</span>
            <span className="label">Home</span>
          </Link>
          <Link to="/leaderboard" className={`sidebar-link ${location.pathname === '/leaderboard' ? 'active' : ''}`} onClick={handleLinkClick}>
            <span className="icon">🏅</span>
            <span className="label">Leaderboard</span>
          </Link>
          <Link to="/history" className={`sidebar-link ${location.pathname === '/history' ? 'active' : ''}`} onClick={handleLinkClick}>
            <span className="icon">📜</span>
            <span className="label">My History</span>
          </Link>
          <Link to="/leagues" className={`sidebar-link ${location.pathname === '/leagues' ? 'active' : ''}`} onClick={handleLinkClick}>
            <span className="icon">👥</span>
            <span className="label">Leagues</span>
          </Link>

          <div className="sidebar-auth" style={{ marginBottom: '1rem' }}>
            <Link to="/login" className="sidebar-link login-link" onClick={handleLinkClick}>
              <span className="icon">🔑</span>
              <span className="label">Login</span>
            </Link>
          </div>

        </div>

        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '→' : '←'}
        </button>
      </nav>
    </>
  );
}

export default Sidebar;