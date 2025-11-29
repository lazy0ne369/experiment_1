export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface PropertyDetails {
  id: string;
  userId: string;
  propertyType: 'apartment' | 'villa' | 'independent_house' | 'plot';
  size: number;
  budget: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  yearBuilt: number;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'interior' | 'exterior' | 'structural' | 'landscaping' | 'amenities';
  estimatedCost: { min: number; max: number };
  valueIncrease: number;
  priority: 'high' | 'medium' | 'low';
  applicableTo: PropertyDetails['propertyType'][];
  conditionRequired: PropertyDetails['condition'][];
}

export interface UserRecommendation {
  recommendation: Recommendation;
  estimatedCostForProperty: number;
  expectedValueIncrease: number;
  roi: number;
}

export interface PropertySubmission extends PropertyDetails {
  recommendations: UserRecommendation[];
}
