import { useState, useEffect } from 'react';
import API from '../api';
import EventCard from '../components/EventCard';

function Home() {
  const [user, setUser] = useState(null);
  const [f1Events, setF1Events] = useState([]);
  const [footballEvents, setFootballEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data for now - will connect to real API later
      setUser({ username: 'TestUser' });
      setF1Events([
        { id: 1, name: 'Monaco GP', event_date: '2026-08-20', sport: 'F1', lock_time: '2026-08-20T10:00:00' },
        { id: 2, name: 'Silverstone GP', event_date: '2026-08-27', sport: 'F1', lock_time: '2026-08-27T10:00:00' }
      ]);
      setFootballEvents([
        { id: 3, name: 'Liverpool vs Arsenal', event_date: '2026-08-21', sport: 'Football', lock_time: '2026-08-21T14:00:00' },
        { id: 4, name: 'Manchester City vs Chelsea', event_date: '2026-08-22', sport: 'Football', lock_time: '2026-08-22T14:00:00' }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upcoming Events</h1>
      
      <h2>Formula 1</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {f1Events.map(event => (
          <EventCard key={event.id} event={event} user={user} />
        ))}
      </div>

      <h2>Football</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {footballEvents.map(event => (
          <EventCard key={event.id} event={event} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Home;
