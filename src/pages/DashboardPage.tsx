import { useAuth } from '../hooks/useAuth';
import { getUserSubmissions } from '../utils/storage';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/recommendations';
import { Plus, Home, TrendingUp, Calendar, MapPin } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const submissions = user ? getUserSubmissions(user.id) : [];

  const latestSubmission = submissions.length > 0 
    ? submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  const totalValueIncrease = latestSubmission
    ? latestSubmission.recommendations.reduce((sum, r) => sum + r.expectedValueIncrease, 0)
    : 0;

  const totalCost = latestSubmission
    ? latestSubmission.recommendations.reduce((sum, r) => sum + r.estimatedCostForProperty, 0)
    : 0;

  const propertyTypeLabels = {
    apartment: 'Apartment',
    villa: 'Villa',
    independent_house: 'Independent House',
    plot: 'Plot',
  };

  const conditionLabels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>Track your property improvements and recommendations</p>
        </div>
        <Link to="/submit-property" className="add-property-btn">
          <Plus size={20} />
          {submissions.length > 0 ? 'Submit New Property' : 'Add Property'}
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h2>No Properties Yet</h2>
          <p>Submit your property details to get personalized improvement recommendations.</p>
          <Link to="/submit-property" className="cta-button">
            Submit Your First Property
          </Link>
        </div>
      ) : (
        <>
          {latestSubmission && (
            <div className="property-overview">
              <div className="property-card">
                <div className="property-header">
                  <Home size={24} />
                  <h2>Latest Property</h2>
                </div>
                <div className="property-details">
                  <div className="detail-item">
                    <span className="label">Type</span>
                    <span className="value">{propertyTypeLabels[latestSubmission.propertyType]}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Size</span>
                    <span className="value">{latestSubmission.size} sq ft</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Condition</span>
                    <span className="value">{conditionLabels[latestSubmission.condition]}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span className="value">{latestSubmission.location}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span className="value">Built in {latestSubmission.yearBuilt}</span>
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <TrendingUp size={32} />
                  <div className="stat-content">
                    <span className="stat-label">Potential Value Increase</span>
                    <span className="stat-value positive">{formatCurrency(totalValueIncrease)}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💰</span>
                  <div className="stat-content">
                    <span className="stat-label">Total Investment</span>
                    <span className="stat-value">{formatCurrency(totalCost)}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">📊</span>
                  <div className="stat-content">
                    <span className="stat-label">Budget</span>
                    <span className="stat-value">{formatCurrency(latestSubmission.budget)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {latestSubmission && latestSubmission.recommendations.length > 0 && (
            <section className="recommendations-section">
              <h2>Your Personalized Recommendations</h2>
              <p className="section-desc">
                Based on your property details, here are the top improvements to maximize value:
              </p>
              <div className="recommendations-grid">
                {latestSubmission.recommendations.map((rec) => (
                  <RecommendationCard key={rec.recommendation.id} userRec={rec} />
                ))}
              </div>
            </section>
          )}

          {submissions.length > 1 && (
            <section className="history-section">
              <h2>Submission History</h2>
              <div className="history-list">
                {submissions.slice(1).map((sub) => (
                  <div key={sub.id} className="history-item">
                    <div className="history-info">
                      <span className="history-type">{propertyTypeLabels[sub.propertyType]}</span>
                      <span className="history-location">{sub.location}</span>
                    </div>
                    <span className="history-date">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
