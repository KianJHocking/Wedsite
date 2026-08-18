import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/ProtectedRoute';
import { Heart, Calendar, Compass, HelpCircle, MailOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const { guest } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate countdown to wedding date (set to August 18, 2027)
  useEffect(() => {
    const weddingDate = new Date('August 18, 2027 15:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container fade-in">
      <div className="hero">
        <div className="hero-hearts">
          <Heart fill="currentColor" size={32} />
        </div>
        <h1>We're Getting Married!</h1>
        <p className="hero-date">August 18, 2027 • London, UK</p>
        
        {guest && (
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.8rem', 
            fontStyle: 'italic', 
            fontWeight: 400,
            color: 'var(--color-primary)',
            margin: '2rem 0'
          }}>
            Welcome, {guest.name}
          </h2>
        )}

        <div className="countdown">
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      </div>

      <section className="toc-section">
        <div className="toc-title">
          <h2>Website Guide</h2>
          <div className="page-divider"></div>
          <p className="page-subtitle">Use the quick-navigation cards below to explore details of our special day.</p>
        </div>

        <div className="toc-grid">
          <Link to="/story" className="card toc-card">
            <div className="toc-icon-wrapper">
              <Compass size={28} />
            </div>
            <h3>Our Story</h3>
            <p>Read about how we met, our journey together, and see a collection of our favourite memories.</p>
          </Link>

          <Link to="/rsvp" className="card toc-card">
            <div className="toc-icon-wrapper">
              <MailOpen size={28} />
            </div>
            <h3>Confirm Attendance</h3>
            <p>Let us know if you can make it, choose your culinary preferences, and submit dietary requirements.</p>
          </Link>

          <Link to="/faqs" className="card toc-card">
            <div className="toc-icon-wrapper">
              <HelpCircle size={28} />
            </div>
            <h3>General FAQs</h3>
            <p>Find answers regarding transport directions, dress codes, accommodations, gifts, and scheduling.</p>
          </Link>
        </div>
      </section>

      <section className="card" style={{ textAlign: 'center', marginTop: '4rem', padding: '3.5rem 2rem' }}>
        <Calendar style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }} size={36} />
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>The Celebration</h2>
        <p style={{ color: 'var(--color-text-light)', maxWidth: '700px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
          We can’t wait to celebrate our union with those we love most. The ceremony will begin at 3:00 PM on Tuesday, August 18, 2027, followed by a formal reception dinner and dance celebration.
        </p>
        <Link to="/rsvp" className="btn btn-primary">
          Let us know you're coming
        </Link>
      </section>
    </div>
  );
};
