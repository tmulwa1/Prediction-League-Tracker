import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './EventCard.css';

function EventCard({ event, user }) {
  const isLocked = new Date(event.lock_time) < new Date();
  const eventDate = new Date(event.event_date);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      className={`event-card ${isLocked ? 'locked' : ''}`}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="event-header">
        <div className="event-sport-badge">
          {event.sport === 'F1' ? '🏎️' : '⚽'}
        </div>
        <div className="event-status">
          {isLocked ? (
            <span className="status-badge closed">🔒 Closed</span>
          ) : (
            <span className="status-badge open">🟢 Open</span>
          )}
        </div>
      </div>

      <div className="event-body">
        <h3 className="event-name">{event.name}</h3>
        
        {/*Adding team crests*/}
        {event.sport === 'Football' && (
          <div className="football-logos" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            {event.home_logo && <img src={event.home_logo} alt={event.home_team} style={{ width: '40px', height: '40px' }} />}
            <span style={{ fontWeight: 'bold', alignSelf: 'center' }}>VS</span>
            {event.away_logo && <img src={event.away_logo} alt={event.away_team} style={{ width: '40px', height: '40px' }} />}
          </div>
        )}

        <div className="event-meta">
          <span className="event-date">📅 {formatDate(eventDate)}</span>
          <span className="event-sport">{event.sport}</span>
        </div>
        {event.sport === 'F1' && (
          <div className="event-tag">Formula 1</div>
        )}
        {event.sport === 'Football' && (
          <div className="event-tag">Football</div>
        )}
      </div>

      <div className="event-footer">
        {user ? (
          isLocked ? (
            <button className="btn btn-disabled" disabled>
              Predictions Closed
            </button>
          ) : (
            <Link to={`/predict/${event.id}`}>
              <motion.button 
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Make Prediction →
              </motion.button>
            </Link>
          )
        ) : (
        // Disabling login to predict button
          !isLocked ? (
            <Link to="/login">
              <motion.button 
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login to Predict
              </motion.button>
            </Link>
          ) : (
            <button className="btn btn-disabled" disabled>
              Predictions Closed
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}

export default EventCard;