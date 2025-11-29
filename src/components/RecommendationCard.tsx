import type { UserRecommendation } from '../types';
import { formatCurrency } from '../utils/recommendations';
import { TrendingUp, IndianRupee, Percent, ArrowUpRight } from 'lucide-react';
import './RecommendationCard.css';

interface RecommendationCardProps {
  userRec: UserRecommendation;
}

export default function RecommendationCard({ userRec }: RecommendationCardProps) {
  const { recommendation, estimatedCostForProperty, expectedValueIncrease, roi } = userRec;

  const priorityColors = {
    high: '#e74c3c',
    medium: '#f39c12',
    low: '#27ae60',
  };

  const categoryIcons = {
    interior: '🏠',
    exterior: '🏢',
    structural: '🔧',
    landscaping: '🌳',
    amenities: '⚡',
  };

  return (
    <div className="recommendation-card">
      <div className="card-header">
        <span className="category-icon">{categoryIcons[recommendation.category]}</span>
        <span 
          className="priority-badge"
          style={{ backgroundColor: priorityColors[recommendation.priority] }}
        >
          {recommendation.priority.toUpperCase()}
        </span>
      </div>
      
      <h3 className="card-title">{recommendation.title}</h3>
      <p className="card-description">{recommendation.description}</p>

      <div className="card-stats">
        <div className="stat">
          <IndianRupee size={16} />
          <div>
            <span className="stat-label">Estimated Cost</span>
            <span className="stat-value">{formatCurrency(estimatedCostForProperty)}</span>
          </div>
        </div>
        
        <div className="stat">
          <TrendingUp size={16} />
          <div>
            <span className="stat-label">Value Increase</span>
            <span className="stat-value positive">{formatCurrency(expectedValueIncrease)}</span>
          </div>
        </div>
        
        <div className="stat">
          <Percent size={16} />
          <div>
            <span className="stat-label">ROI</span>
            <span className={`stat-value ${roi > 0 ? 'positive' : 'negative'}`}>
              {roi > 0 ? '+' : ''}{roi}%
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <span className="category-label">{recommendation.category}</span>
        <ArrowUpRight size={20} className="arrow-icon" />
      </div>
    </div>
  );
}
