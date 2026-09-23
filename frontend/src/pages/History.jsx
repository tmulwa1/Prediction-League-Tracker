import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api";
import './History.css';

function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Fetches user histroy from backend API
  const fetchHistory = async () => {
    try {
      const res = await API.get('/history');
      // Takes existing predictions or an empty list
      setPredictions(res.data.history || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading your predictions...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="history-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="history-header">
        <h1>📜 My Prediction History</h1>
        <p>Track your past predictions and points</p>
      </div>

      <div className="history-list">
        {predictions.length === 0 ? (
          <div className="empty-state">
            <h3>No predictions yet</h3>
            <p>Start predicting upcoming events to see your history here!</p>
          </div>
        ) : (
          predictions.map((prediction, index) => (
            <motion.div
              key={index}
              className="history-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/*Card header row*/}
              <div className="history-item-header">
                <span className="history-sport-badge">
                  {prediction.sport === 'F1' ? '🏎️' : '⚽'}
                </span>
                <span className="history-event-name">{prediction.event_name}</span>
                {/*Shows status depending on the is_finished boolean*/}
                <span className={`history-status ${prediction.is_finished ? 'finished' : 'pending'}`}>
                  {prediction.is_finished ? 'Finished' : 'Pending'}
                </span>
              </div>

              <div className="history-prediction-details">
                {/*F1 branch*/}
                {prediction.sport === 'F1' && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Predicted Winner:</span>
                      <span className="detail-value">{prediction.predicted_winner || 'N/A'}</span>
                    </div>
                    {prediction.predicted_podium && prediction.predicted_podium.length > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Predicted Podium:</span>
                        <span className="detail-value">
                          {prediction.predicted_podium.join(', ')}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/*Football branch*/}
                {prediction.sport === 'Football' && (
                  <div className="detail-row">
                    <span className="detail-label">Predicted Score:</span>
                    <span className="detail-value">
                      {prediction.predicted_home_score} - {prediction.predicted_away_score}
                    </span>
                  </div>
                )}

                {/* Points awarded row */}
                <div className="detail-row points-row">
                  <span className="detail-label">Points Awarded:</span>
                  <span className={`detail-value points ${prediction.points_awarded > 0 ? 'positive' : 'zero'}`}>
                    {prediction.points_awarded}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default History;