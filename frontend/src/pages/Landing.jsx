import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Landing.css';

const F1_IMAGE = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";
const FOOTBALL_IMAGE = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop";

function Landing() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Auto-slides every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="landing-container">
            {/*Background images with fade transition*/}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    className="landing-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ backgroundImage: `url(${currentSlide === 0 ? F1_IMAGE : FOOTBALL_IMAGE})`}}
                />
            </AnimatePresence>

            <div className="landing-overlay"></div>

            {/*Navbar*/}
            <div className="landing-nav">
                <div className="landing-logo">🏆 PREDICTION LEAGUE</div>
                <button className="landing-login-btn" onClick={() => navigate('/login')}>
                    SIGN IN
                </button>
            </div>

            {/*Main content*/}
            <div className="landing-hero">
                {currentSlide === 0 ? (
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="hero-subtitle">The Premier Racing</div>
                        <div className="hero-title">BOOST</div>
                        <div className="hero-description">
                            Real-time F1 analytics, driver predictoins, and championship tracking.
                        </div>
                        <div className="hero-cta" onClick={() => navigate('/login')}>
                            PREDICT NOW
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="hero-subtitle">The Ultimate League</div>
                        <div className="hero-title">SCORE</div>
                        <div className="hero-description">
                            Predict match outcomes, track your goals, and climb the leaderboard.
                        </div>
                        <div className="hero-cta" onClick={() => navigate('/login')}>
                            PREDICT NOW
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="landing-indicators">
                <div className={`indicator ${currentSlide === 0 ? 'active' : ''}`} />
                <div className={`indicator ${currentSlide === 1 ? 'active' : ''}`} />
            </div>
        </div>
    )
}

export default Landing;