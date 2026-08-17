import { Link } from 'react-router-dom';

function Navbar({ user }) {
  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#333',
      color: 'white',
      display: 'flex',
      gap: '2rem',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        Prediction League
      </Link>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/leaderboard" style={{ color: 'white', textDecoration: 'none' }}>Leaderboard</Link>
      {user ? (
        <>
          <Link to="/history" style={{ color: 'white', textDecoration: 'none' }}>My History</Link>
          <span style={{ marginLeft: 'auto' }}>Welcome, {user.username}</span>
          <Link to="/logout" style={{ color: 'white', textDecoration: 'none' }}>Logout</Link>
        </>
      ) : (
        <Link to="/login" style={{ marginLeft: 'auto', color: 'white', textDecoration: 'none' }}>Login</Link>
      )}
    </nav>
  );
}

export default Navbar;