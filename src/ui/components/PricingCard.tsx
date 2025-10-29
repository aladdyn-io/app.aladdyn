import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onButtonClick: () => void;
  badge?: string;
  savings?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  buttonText,
  isPopular = false,
  isCurrentPlan = false,
  onButtonClick,
  badge,
  savings
}) => {
  return (
    <div className={`relative bg-white rounded-xl border shadow-sm p-6 h-full flex flex-col ${
      isPopular 
        ? 'border-emerald-200 ring-2 ring-emerald-100' 
        : isCurrentPlan
        ? 'border-blue-200 ring-2 ring-blue-100'
        : 'border-gray-200'
    }`}>
      {/* Badges at top */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        {isPopular && !isCurrentPlan && (
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        )}
        {isCurrentPlan && (
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Current Plan
          </span>
        )}
        {badge && !isCurrentPlan && (
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {badge}
          </span>
        )}
      </div>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="text-3xl font-bold text-gray-900 mb-2">{price}</div>
        {savings && (
          <p className="text-emerald-600 text-sm font-medium">{savings}</p>
        )}
      </div>
      
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onButtonClick}
        disabled={isCurrentPlan}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          isCurrentPlan
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isPopular
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};