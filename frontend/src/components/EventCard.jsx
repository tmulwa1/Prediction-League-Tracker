import { Link } from 'react-router-dom';

function EventCard({ event, user }) {
  const isLocked = new Date(event.lock_time) < new Date();
  
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3>{event.name}</h3>
        <p>Date: {new Date(event.event_date).toLocaleString()}</p>
        <p>Sport: {event.sport}</p>
        {event.sport === 'F1' && <p>🏎️ Formula 1</p>}
        {event.sport === 'Football' && <p>⚽ Football</p>}
      </div>
      <div>
        {user ? (
          isLocked ? (
            <span style={{ color: 'red' }}>Predictions Closed</span>
          ) : (
            <Link to={`/predict/${event.id}`}>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Make Prediction
              </button>
            </Link>
          )
        ) : (
          <Link to="/login">
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Login to Predict
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default EventCard;
