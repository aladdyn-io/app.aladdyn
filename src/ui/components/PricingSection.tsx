import React from 'react';
import { PricingCard } from './PricingCard';

const pricingPlans = [
  {
    title: 'Freemium',
    description: 'Perfect for getting started',
    price: 'Free',
    features: [
      '1 Demo App',
      '10 Page Scraping',
      'Retrain NOT ALLOWED',
      '5 chat - without login',
      'Unlimited chat',
      'No analytics and leads'
    ],
    buttonText: 'Start Free',
    isPopular: false
  },
  {
    title: 'Basic',
    description: 'Great for small projects',
    price: '$n/month',
    features: [
      '1 Basic Apps',
      '35 Pages Scraping',
      'Unlimited retrain',
      'Unlimited chat',
      'No analytics, will have leads'
    ],
    buttonText: 'Upgrade Now',
    isPopular: false
  },
  {
    title: 'Ecommerce',
    description: 'Perfect for online stores',
    price: '$n/month',
    features: [
      '1 Basic Apps',
      'Shopify Q ⌛',
      'Unlimited retrain',
      'Unlimited chat'
    ],
    buttonText: 'Start Ecommerce',
    isPopular: false
  },
  {
    title: 'Pro',
    description: 'Most popular for growing teams',
    price: '$5n/month',
    features: [
      '5 Pro Apps',
      '35 Pages Scraping Each',
      'Unlimited retrain',
      'Unlimited chat',
      'Will have analytics and leads'
    ],
    buttonText: 'Start Pro',
    isPopular: true
  },
  {
    title: 'Enterprise',
    description: 'Advanced features for large teams',
    price: 'Contact',
    features: [
      'Contact for custom apps',
      'Custom page scraping limits',
      'Unlimited retrain',
      'Unlimited chat',
      'Full analytics and leads',
      'Priority support'
    ],
    buttonText: 'Get a Demo',
    isPopular: false
  }
];

export const PricingSection: React.FC = () => {
  const handleButtonClick = (planTitle: string) => {
    console.log(`Selected plan: ${planTitle}`);
    // Add your button click logic here
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find a plan to power your apps
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Supports teams of all sizes, with pricing that scales with your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              buttonText={plan.buttonText}
              isPopular={plan.isPopular}
              onButtonClick={() => handleButtonClick(plan.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};