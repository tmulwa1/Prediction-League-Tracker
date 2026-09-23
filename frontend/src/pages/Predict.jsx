import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import './Predict.css';

function Predict() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [existingPrediction, setExistingPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // State for F1
  const [drivers, setDrivers] = useState([]);
  const [predictedWinner, setPredictedWinner] = useState('');
  const [podium1, setPodium1] = useState('');
  const [podium2, setPodium2] = useState('');
  const [podium3, setPodium3] = useState('');

  // State for Football
  const [predictedHome, setPredictedHome] = useState('');
  const [predictedAway, setPredictedAway] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await API.get(`/event/${eventId}`);
        setEvent(eventRes.data.event);
        setDrivers(eventRes.data.drivers || []); // <--- THIS FILLS THE DROPDOWN
        
        try {
          const predRes = await API.get(`/predictions/${eventId}`);
          const pred = predRes.data.prediction;
          
          if (pred) {
            setExistingPrediction(pred);
            
            if (eventRes.data.event.sport === 'F1') {
              setPredictedWinner(pred.predicted_winner || '');
              const podium = pred.predicted_podium || [];
              setPodium1(podium[0] || '');
              setPodium2(podium[1] || '');
              setPodium3(podium[2] || '');
            } else {
              setPredictedHome(pred.predicted_home_score || '');
              setPredictedAway(pred.predicted_away_score || '');
            }
          }
        } catch (err) {
          console.log('No prior prediction found');
        }

      } catch (err) {
        console.error('Error loading prediction page:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {};

      if (event.sport === 'F1') {
        payload.predicted_winner = predictedWinner;
        payload.predicted_podium = [podium1, podium2, podium3].filter(Boolean);
      } else {
        payload.predicted_home_score = parseInt(predictedHome);
        payload.predicted_away_score = parseInt(predictedAway);
      }

      await API.post(`/predictions/${eventId}`, payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving prediction:', err);
      setError('Failed to save prediction. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading prediction form...</p>
      </div>
    );
  }

  if (!event) return <div>Event not found</div>;

  return (
    <motion.div 
      className="predict-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="predict-header">
        <h1 className="predict-title">{event.name}</h1>
        <p className="predict-subtitle">
          {event.sport} - Predictions close {new Date(event.lock_time).toLocaleString()}
        </p>
      </div>

      {existingPrediction && (
        <div className="existing-prediction-notice">
          You've already predicted this event - submitting again will update your prediction
        </div>
      )}

      {/* Form Card */}
      <div className="predict-card">
        <form onSubmit={handleSubmit} className="predict-form">
          {error && <div className="error-message">{error}</div>}

          {/* F1 Branch */}
          {event.sport === 'F1' && (
            <>
              <div className="form-group">
                <label className="form-label">Predicted Winner</label>
                <select 
                  className="form-select"
                  value={predictedWinner} 
                  onChange={(e) => setPredictedWinner(e.target.value)}
                  required
                >
                  <option value="">Select a driver...</option>
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <option key={driver} value={driver}>{driver}</option>
                    ))
                  ) : (
                    <option value="" disabled>No drivers available</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Predicted Podium</label>
                <div className="podium-container">
                  <div className="podium-item">
                    <label className="form-label">P1</label>
                    <select 
                      className="form-select"
                      value={podium1} 
                      onChange={(e) => setPodium1(e.target.value)}
                    >
                      <option value="">Select...</option>
                      {drivers.map((driver) => (
                        <option key={driver} value={driver}>{driver}</option>
                      ))}
                    </select>
                  </div>
                  <div className="podium-item">
                    <label className="form-label">P2</label>
                    <select 
                      className="form-select"
                      value={podium2} 
                      onChange={(e) => setPodium2(e.target.value)}
                    >
                      <option value="">Select...</option>
                      {drivers.map((driver) => (
                        <option key={driver} value={driver}>{driver}</option>
                      ))}
                    </select>
                  </div>
                  <div className="podium-item">
                    <label className="form-label">P3</label>
                    <select 
                      className="form-select"
                      value={podium3} 
                      onChange={(e) => setPodium3(e.target.value)}
                    >
                      <option value="">Select...</option>
                      {drivers.map((driver) => (
                        <option key={driver} value={driver}>{driver}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Football Branch */}
          {event.sport === 'Football' && (
            <div className="scores-container">
              <div className="form-group">
                <label className="form-label">
                  Predicted {event.home_team} (Home) Score
                </label>
                <input 
                  className="form-input"
                  type="number" 
                  min="0"
                  value={predictedHome} 
                  onChange={(e) => setPredictedHome(e.target.value)}
                  placeholder="Enter home score"
                  required
                />
              </div>
              <div className="vs-text">VS</div>
              <div className="form-group">
                <label className="form-label">
                  Predicted {event.away_team} (Away) Score
                </label>
                <input 
                  className="form-input"
                  type="number" 
                  min="0"
                  value={predictedAway} 
                  onChange={(e) => setPredictedAway(e.target.value)}
                  placeholder="Enter away score"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Saving...' : existingPrediction ? 'Update Prediction' : 'Submit Prediction'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Predict;