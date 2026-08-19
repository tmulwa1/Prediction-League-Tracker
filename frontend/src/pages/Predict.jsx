import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import API from '../api';
import { useNavigate, useParams } from "react-router-dom";

function Predict() {
  // Getting the id from the URL
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [existingPrediction, setExistingPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [predictedWinner, setPredictedWinner] = useState('');
  const [predictedPodium, setPredictedPodium] = useState('');
  const [predictedHome, setPredictedHome] = useState('');
  const [predictedAway, setPredictedAway] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await API.get(`/event/${eventId}`);
        setEvent(eventRes.data.event);

        try {
          const predRes = await API.get(`/predictions/${eventId}`);
          const pred = predRes.data.predidction;

          if (pred) {
            setExistingPrediction(pred);

            // Pre-fills form if prediction already exists
            if (eventRes.data.event.sport === 'F1') {
              setPredictedWinner(pred.predicted_winner || '');
              setPredictedPodium(Array.isArray(pred.predicted_podium) ? pred.predicted_podium.join(',') : pred.predicted_podium || '');
            } else {
              setPredictedHome(pred.predicted_home_score || '');
              setPredictedAway(pred.predicted_away_score || '');
            }
          } 
        } catch (error) {
          setError('No prior predictions found');
        }  
      } catch (error) {
        setError('Failed to load event details');
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
        // Converts string back into array
        payload.predicted_podium = predictedPodium ? predictedPodium.split(',').map(s => s.trim()) : [];
      } else {
        payload.predicted_home_score = parseInt(predictedHome);
        payload.predicted_away_score = parseInt(predictedAway);
      }

      await API.post(`/predictions/${eventId}`, payload);
      navigate('/');
    } catch (error) {
      setError('Failed to save prediction. Please try again');
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      Loading prediction form...
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#dc3545' }}>
      <h2>OOPS!</h2>
      <p>{error}</p>
      <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Back</button>
    </div>
  );

  if (!event) return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>Event not found</div>
  )

  return (
    <motion.div 
      className="predict-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="predict-title">{event.name}</h1>
      
      <form onSubmit={handleSubmit} className="predict-form">
        
        {/* F1 Form */}
        {event.sport === 'F1' && (
          <div className="form-group">
            <label>Predicted Winner</label>
            <select 
              value={predictedWinner} 
              onChange={(e) => setPredictedWinner(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '18px solid #ccc'}}
            >
              <option value="">Select a driver...</option>
              {/*Mapping over drivers*/}
              {event.drivers && event.drivers.map((driver) => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
          </div>
        )}

        {/* Football Form */}
        {event.sport === 'Football' && (
          <div className="football-scores" style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center'}}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'center' }}>{event.home_team}</label>
              <input 
                type="number" 
                min="0"
                value={predictedHome} 
                onChange={(e) => setPredictedHome(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', textAlign: 'center', fontSize: '1.2rem' }}
              />
            </div>
            <span className="vs-text" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#666' }}>VS</span>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'center' }}>{event.away_team}</label>
              <input 
                type="number" 
                min="0"
                value={predictedAway} 
                onChange={(e) => setPredictedAway(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', textAlign: 'center', fontSize: '1.2rem' }}
              />
            </div>
          </div>
        )}

        <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
            {submitting ? 'Saving...' : existingPrediction ? 'Update Prediction' : 'Submit Prediction'}
          </button>
        </div>

      </form>
    </motion.div>
  );
}

export default Predict;