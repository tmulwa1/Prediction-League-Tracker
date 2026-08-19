import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import EventCard from '../components/EventCard';
import './Home.css';

function Home({user, setUser}) {
  const [f1Events, setF1Events] = useState([]);
  const [footballEvents, setFootballEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
    try { 
      if(!user) {
        // Fetch user info
        try {
          const userRes = await API.get('/user');
          if (userRes.data.user) {
            setUser(userRes.data.user);
          }
        } catch (userError) {
          console.log('User not logged in');
        }
      }

      const eventRes = await API.get('/events');

      // Returns empty list if not found
      setF1Events(eventRes.data.f1_events || []);
      setFootballEvents(eventRes.data.football_events || []);
      
      // Turn off loading
      setLoading(false);

    } catch(error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

    return (
    <div className="home-container">
      <motion.div
        className="header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">🏆 Upcoming Events</h1>
        {user && (
          <motion.p
            className="welcome-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome back, <strong>{user.username}</strong>! 👏
          </motion.p>
        )}
      </motion.div> 

      <div className="events-grid">
        {/*F1 section*/}
        {f1Events.length > 0 && (
          <motion.section
            className="sport-section"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="section-header">
              <h2>🏎️ F1 Races</h2>
              <span className="event-count">{f1Events.length} races</span>
            </div>

            <div className="cards-container">
              <AnimatePresence>
                {f1Events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="card-wrapper"
                  >
                    <EventCard event={event} user={user} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/*Football section*/}
        {footballEvents.length > 0 && (
          <motion.section
            className="sport-section"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="section-header">
              <h2>⚽ Football Matches</h2>
              <span className="event-count">{footballEvents.length} matches</span>
            </div>

            <div className="cards-container">
              <AnimatePresence>
                {footballEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="card-wrapper"
                  >
                    <EventCard event={event} user={user} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/*Returns error message if both lists are empty*/}
        {f1Events.length === 0 && footballEvents.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', marginTop: '3rem', color: '#666' }}>
            <h3>No upcoming events found</h3>
            <p>Check back later for new F1 races and football matches!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
