import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Home, TrendingUp, Shield, Award } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <Home size={40} />,
      title: 'Property Assessment',
      description: 'Submit your property details and get a comprehensive analysis of improvement opportunities.',
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Value Predictions',
      description: 'See estimated value increases for each recommended improvement with ROI calculations.',
    },
    {
      icon: <Shield size={40} />,
      title: 'Expert Recommendations',
      description: 'Curated suggestions tailored for Indian middle-class homes and budgets.',
    },
    {
      icon: <Award size={40} />,
      title: 'Priority Based',
      description: 'Recommendations ranked by impact and cost-effectiveness to maximize your returns.',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Increase Your Property Value</h1>
          <p className="hero-subtitle">
            Get personalized recommendations to enhance your home and maximize its market value.
            Designed specifically for Indian middle-class homeowners.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to="/submit-property" className="cta-button primary">
                Submit Your Property <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="cta-button primary">
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="cta-button secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <div className="card-icon">🏡</div>
            <h3>Your Dream Home</h3>
            <p>Value Enhancement Platform</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Boost Your Property Value?</h2>
        <p>Join thousands of homeowners who have increased their property value with our guidance.</p>
        {user ? (
          <Link to="/submit-property" className="cta-button primary large">
            Submit Property Details <ArrowRight size={24} />
          </Link>
        ) : (
          <Link to="/signup" className="cta-button primary large">
            Create Free Account <ArrowRight size={24} />
          </Link>
        )}
      </section>
    </div>
  );
}
