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
          {/*Shows the emoji based on the sport*/}
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
          <Link to="/login">
            <motion.button 
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login to Predict
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default EventCard;