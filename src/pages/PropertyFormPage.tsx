import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { saveSubmission } from '../utils/storage';
import { generateRecommendations } from '../utils/recommendations';
import type { PropertyDetails, PropertySubmission } from '../types';
import { Ruler, IndianRupee, MapPin, Calendar, CheckCircle } from 'lucide-react';
import './PropertyFormPage.css';

const currentYear = new Date().getFullYear();

const propertySchema = z.object({
  propertyType: z.enum(['apartment', 'villa', 'independent_house', 'plot'], {
    message: 'Please select a property type',
  }),
  size: z.number({
    message: 'Please enter a valid number',
  }).min(100, 'Size must be at least 100 sq ft').max(50000, 'Size cannot exceed 50,000 sq ft'),
  budget: z.number({
    message: 'Please enter a valid number',
  }).min(50000, 'Budget must be at least ₹50,000').max(50000000, 'Budget cannot exceed ₹5 Cr'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor'], {
    message: 'Please select property condition',
  }),
  location: z.string().min(3, 'Location must be at least 3 characters').max(100, 'Location is too long'),
  yearBuilt: z.number({
    message: 'Please enter a valid year',
  }).min(1900, 'Year must be after 1900').max(currentYear, `Year cannot be in the future`),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function PropertyFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const onSubmit = (data: PropertyFormData) => {
    if (!user) return;

    setIsSubmitting(true);

    const propertyDetails: PropertyDetails = {
      id: crypto.randomUUID(),
      userId: user.id,
      propertyType: data.propertyType,
      size: data.size,
      budget: data.budget,
      condition: data.condition,
      location: data.location,
      yearBuilt: data.yearBuilt,
      createdAt: new Date().toISOString(),
    };

    const recommendations = generateRecommendations(propertyDetails);

    const submission: PropertySubmission = {
      ...propertyDetails,
      recommendations,
    };

    saveSubmission(submission);
    navigate('/dashboard');
  };

  return (
    <div className="property-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Property Details</h1>
          <p>Tell us about your property to get personalized improvement recommendations</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="property-form">
          <div className="form-group">
            <label>Property Type</label>
            <div className="radio-group">
              {[
                { value: 'apartment', label: 'Apartment', icon: '🏢' },
                { value: 'villa', label: 'Villa', icon: '🏡' },
                { value: 'independent_house', label: 'Independent House', icon: '🏠' },
                { value: 'plot', label: 'Plot', icon: '📐' },
              ].map((option) => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('propertyType')}
                  />
                  <span className="radio-content">
                    <span className="radio-icon">{option.icon}</span>
                    <span className="radio-label">{option.label}</span>
                    <CheckCircle className="check-icon" size={20} />
                  </span>
                </label>
              ))}
            </div>
            {errors.propertyType && <span className="error-message">{errors.propertyType.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="size">
                <Ruler size={18} />
                Property Size (sq ft)
              </label>
              <input
                id="size"
                type="number"
                placeholder="e.g., 1200"
                {...register('size', { valueAsNumber: true })}
                className={errors.size ? 'error' : ''}
              />
              {errors.size && <span className="error-message">{errors.size.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="budget">
                <IndianRupee size={18} />
                Improvement Budget (₹)
              </label>
              <input
                id="budget"
                type="number"
                placeholder="e.g., 500000"
                {...register('budget', { valueAsNumber: true })}
                className={errors.budget ? 'error' : ''}
              />
              {errors.budget && <span className="error-message">{errors.budget.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Current Condition</label>
            <div className="condition-group">
              {[
                { value: 'excellent', label: 'Excellent', desc: 'Like new, minimal improvements needed' },
                { value: 'good', label: 'Good', desc: 'Well maintained, minor updates helpful' },
                { value: 'fair', label: 'Fair', desc: 'Some wear, moderate improvements needed' },
                { value: 'poor', label: 'Poor', desc: 'Significant improvements required' },
              ].map((option) => (
                <label key={option.value} className="condition-option">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('condition')}
                  />
                  <span className="condition-content">
                    <span className="condition-label">{option.label}</span>
                    <span className="condition-desc">{option.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.condition && <span className="error-message">{errors.condition.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">
                <MapPin size={18} />
                Location / City
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g., Mumbai, Maharashtra"
                {...register('location')}
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="yearBuilt">
                <Calendar size={18} />
                Year Built
              </label>
              <input
                id="yearBuilt"
                type="number"
                placeholder="e.g., 2010"
                {...register('yearBuilt', { valueAsNumber: true })}
                className={errors.yearBuilt ? 'error' : ''}
              />
              {errors.yearBuilt && <span className="error-message">{errors.yearBuilt.message}</span>}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Generating Recommendations...' : 'Get Recommendations'}
          </button>
        </form>
      </div>
    </div>
  );
}
