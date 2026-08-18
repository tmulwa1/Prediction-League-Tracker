import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import API from '../api';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get('/leaderboard');
      // Sets leader board otherwise returns empty list
      setLeaderboard(res.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading rankings...</p>
    </div>
  );

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1>🏅 Leaderboard</h1>
        <p>Top predictors across the league</p>
      </div>

      <div className="leaderboard-list">
        {leaderboard.length === 0 ? (
          <p className="empty-state">No predictions have been made yet. Be the first!</p>
        ) : (
          // Creates map between username and index to display ordered list
          leaderboard.map((user, index) => (
            <motion.div
              key={user.username}
              className={`leaderboard-item ${index === 0 ? 'first-place' : ''} ${index === 1 ? 'second-place' : ''} ${index === 2 ? 'third-place' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="rank">
                <span className="rank-number">#{index + 1}</span>
                {index === 0 && <span className="medal">🥇</span>}
                {index === 1 && <span className="medal">🥈</span>}
                {index === 2 && <span className="medal">🥉</span>}
              </div>
              <div className="user-info">
                <span className="username">{user.username}</span>
              </div>
              <div className="points">
                <span className="points-number">{user.points}</span>
                <span className="points-label">pts</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
export default Leaderboard;