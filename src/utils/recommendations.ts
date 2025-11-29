import type { PropertyDetails, Recommendation, UserRecommendation } from '../types';

export const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Modular Kitchen Upgrade',
    description: 'Install a modern modular kitchen with quality fittings, granite countertops, and efficient storage solutions.',
    category: 'interior',
    estimatedCost: { min: 150000, max: 500000 },
    valueIncrease: 8,
    priority: 'high',
    applicableTo: ['apartment', 'villa', 'independent_house'],
    conditionRequired: ['fair', 'poor', 'good'],
  },
  {
    id: '2',
    title: 'Bathroom Renovation',
    description: 'Upgrade bathrooms with modern fixtures, anti-skid tiles, and water-efficient fittings.',
    category: 'interior',
    estimatedCost: { min: 80000, max: 250000 },
    valueIncrease: 5,
    priority: 'high',
    applicableTo: ['apartment', 'villa', 'independent_house'],
    conditionRequired: ['fair', 'poor', 'good'],
  },
  {
    id: '3',
    title: 'Fresh Paint & Wall Treatment',
    description: 'Repaint interiors with quality paint and add texture/wallpaper to accent walls.',
    category: 'interior',
    estimatedCost: { min: 50000, max: 200000 },
    valueIncrease: 3,
    priority: 'medium',
    applicableTo: ['apartment', 'villa', 'independent_house'],
    conditionRequired: ['fair', 'poor', 'good', 'excellent'],
  },
  {
    id: '4',
    title: 'Flooring Upgrade',
    description: 'Replace old flooring with vitrified tiles, wooden flooring, or marble for premium look.',
    category: 'interior',
    estimatedCost: { min: 100000, max: 400000 },
    valueIncrease: 6,
    priority: 'medium',
    applicableTo: ['apartment', 'villa', 'independent_house'],
    conditionRequired: ['fair', 'poor'],
  },
  {
    id: '5',
    title: 'External Facade Renovation',
    description: 'Improve the exterior appearance with new paint, cladding, or modern design elements.',
    category: 'exterior',
    estimatedCost: { min: 100000, max: 500000 },
    valueIncrease: 7,
    priority: 'high',
    applicableTo: ['villa', 'independent_house'],
    conditionRequired: ['fair', 'poor', 'good'],
  },
  {
    id: '6',
    title: 'Terrace/Balcony Garden',
    description: 'Create a beautiful terrace or balcony garden with planters and seating area.',
    category: 'landscaping',
    estimatedCost: { min: 30000, max: 150000 },
    valueIncrease: 3,
    priority: 'low',
    applicableTo: ['apartment', 'villa', 'independent_house'],
    conditionRequired: ['fair', 'poor', 'good', 'excellent'],
  },
  {
    id: '7',
    title: 'Home Automation System',
    description: 'Install smart home features like automated lighting, security systems, and climate control.',
    category: 'amenities',
    estimatedCost: { min: 100000, max: 500000 },
    valueIncrease: 5,
    priority: 'medium',
    applicableTo: ['apartment', 'villa', 'independent_house'],
    conditionRequired: ['fair', 'good', 'excellent'],
  },
  {
    id: '8',
    title: 'Waterproofing & Sealing',
    description: 'Professional waterproofing treatment for terrace, bathrooms, and external walls.',
    category: 'structural',
    estimatedCost: { min: 50000, max: 200000 },
    valueIncrease: 4,
    priority: 'high',
    applicableTo: ['apartment', 'villa', 'independent_house'],
    conditionRequired: ['fair', 'poor', 'good'],
  },
  {
    id: '9',
    title: 'Compound Wall & Gate',
    description: 'Build or renovate compound wall with decorative gate for better security and aesthetics.',
    category: 'exterior',
    estimatedCost: { min: 100000, max: 400000 },
    valueIncrease: 5,
    priority: 'medium',
    applicableTo: ['villa', 'independent_house', 'plot'],
    conditionRequired: ['fair', 'poor', 'good', 'excellent'],
  },
  {
    id: '10',
    title: 'Garden & Landscaping',
    description: 'Professional landscaping with lawn, plants, and hardscape features.',
    category: 'landscaping',
    estimatedCost: { min: 80000, max: 300000 },
    valueIncrease: 4,
    priority: 'medium',
    applicableTo: ['villa', 'independent_house', 'plot'],
    conditionRequired: ['fair', 'poor', 'good', 'excellent'],
  },
  {
    id: '11',
    title: 'Solar Panel Installation',
    description: 'Install rooftop solar panels for energy savings and sustainability.',
    category: 'amenities',
    estimatedCost: { min: 150000, max: 400000 },
    valueIncrease: 4,
    priority: 'low',
    applicableTo: ['villa', 'independent_house'],
    conditionRequired: ['fair', 'good', 'excellent'],
  },
  {
    id: '12',
    title: 'Parking Area Development',
    description: 'Create or improve covered parking space with proper flooring and shade.',
    category: 'exterior',
    estimatedCost: { min: 100000, max: 300000 },
    valueIncrease: 5,
    priority: 'high',
    applicableTo: ['villa', 'independent_house', 'plot'],
    conditionRequired: ['fair', 'poor', 'good', 'excellent'],
  },
];

export function generateRecommendations(
  property: PropertyDetails,
  recommendations: Recommendation[] = defaultRecommendations
): UserRecommendation[] {
  const filteredRecommendations = recommendations.filter((rec) => {
    const appliesToType = rec.applicableTo.includes(property.propertyType);
    const conditionMatches = rec.conditionRequired.includes(property.condition);
    return appliesToType && conditionMatches;
  });

  const userRecommendations: UserRecommendation[] = filteredRecommendations.map((rec) => {
    // Calculate estimated cost based on property size and budget
    const sizeFactor = property.size / 1000; // Normalize by 1000 sq ft
    const baseCost = (rec.estimatedCost.min + rec.estimatedCost.max) / 2;
    let estimatedCost = Math.round(baseCost * Math.max(0.5, Math.min(2, sizeFactor)));

    // Adjust based on budget
    if (estimatedCost > property.budget * 0.4) {
      estimatedCost = Math.round(property.budget * 0.3);
    }

    // Calculate expected value increase
    const propertyValue = property.size * 5000; // Estimated property value
    const expectedValueIncrease = Math.round((propertyValue * rec.valueIncrease) / 100);

    // Calculate ROI
    const roi = Math.round(((expectedValueIncrease - estimatedCost) / estimatedCost) * 100);

    return {
      recommendation: rec,
      estimatedCostForProperty: estimatedCost,
      expectedValueIncrease,
      roi,
    };
  });

  // Sort by ROI and priority
  return userRecommendations
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.recommendation.priority] !== priorityOrder[b.recommendation.priority]) {
        return priorityOrder[a.recommendation.priority] - priorityOrder[b.recommendation.priority];
      }
      return b.roi - a.roi;
    })
    .slice(0, 6); // Return top 6 recommendations
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}
