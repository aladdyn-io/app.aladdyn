import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingCard } from './PricingCard';
import { toast } from 'sonner';
import api from '@/services/api';
import { useRazorpayCheckout } from '@/components/RazorpayCheckout';
import { Loader2 } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  currency: string;
  interval: string;
  maxApps: number;
  appType: string;
  maxPages: number;
  hasShopify: boolean;
  retrainAllowed: boolean;
  freeChats: number | null;
  hasAnalytics: boolean;
  hasLeads: boolean;
}

const getPlanDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    freemium: 'Perfect for getting started',
    basic: 'Great for small projects',
    ecommerce: 'Perfect for online stores',
    pro: 'Most popular for growing teams',
    enterprise: 'Advanced features for large teams',
  };
  return descriptions[name] || '';
};

const getPlanFeatures = (plan: PricingPlan): string[] => {
  const features: string[] = [];
  
  // Apps
  if (plan.maxApps === 999) {
    features.push('Unlimited Apps');
  } else {
    features.push(`${plan.maxApps} ${plan.appType} App${plan.maxApps > 1 ? 's' : ''}`);
  }
  
  // Pages
  if (plan.maxPages === 9999) {
    features.push('Unlimited Page Scraping');
  } else if (plan.maxApps > 1) {
    features.push(`${plan.maxPages / plan.maxApps} Pages Scraping Each`);
  } else {
    features.push(`${plan.maxPages} Page${plan.maxPages > 1 ? 's' : ''} Scraping`);
  }
  
  // Shopify
  if (plan.hasShopify) {
    features.push('Shopify Integration');
  }
  
  // Retrain
  features.push(plan.retrainAllowed ? 'Unlimited retrain' : 'Retrain NOT ALLOWED');
  
  // Free chats
  if (plan.freeChats) {
    features.push(`${plan.freeChats} chat - without login`);
  }
  
  // Chat
  features.push('Unlimited chat');
  
  // Analytics and leads
  if (plan.hasAnalytics && plan.hasLeads) {
    features.push('Analytics and Leads');
  } else if (plan.hasLeads) {
    features.push('Leads tracking');
    features.push('No analytics');
  } else {
    features.push('No analytics and leads');
  }
  
  return features;
};

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const { initiatePayment } = useRazorpayCheckout({
    planId: selectedPlan?.id || '',
    planName: selectedPlan?.displayName || '',
    amount: selectedPlan?.price || 0,
    onSuccess: (subscription) => {
      setActiveSubscription(subscription);
      toast.success('Subscription activated successfully!');
      navigate('/');
    },
    onError: (error) => {
      console.error('Payment error:', error);
    },
  });

  useEffect(() => {
    fetchPlans();
    fetchActiveSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.getPricingPlans();
      if (response.success && response.data) {
        // Sort plans: Freemium, Basic, Ecommerce, Pro, then Enterprise last
        const sortedPlans = response.data.sort((a: PricingPlan, b: PricingPlan) => {
          const order = ['freemium', 'basic', 'ecommerce', 'pro', 'enterprise'];
          return order.indexOf(a.name) - order.indexOf(b.name);
        });
        setPlans(sortedPlans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await api.getActiveSubscription();
      if (response.success && response.data) {
        setActiveSubscription(response.data);
      }
    } catch (error) {
      // User might not be logged in or doesn't have a subscription
      console.log('No active subscription');
    }
  };

  const handlePlanSelect = async (plan: PricingPlan) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    // Check if already subscribed to this plan
    if (activeSubscription && activeSubscription.planId === plan.id) {
      toast.info('You are already subscribed to this plan');
      return;
    }

    // Free plan
    if (plan.price === 0) {
      try {
        const response = await api.subscribeFreePlan();
        if (response.success) {
          toast.success('Successfully subscribed to free plan!');
          setActiveSubscription(response.data);
          navigate('/');
        }
      } catch (error) {
        toast.error('Failed to subscribe to free plan');
      }
      return;
    }

    // Enterprise plan (price is -1 for contact pricing)
    if (plan.name === 'enterprise' || plan.price === -1) {
      toast.info('Please contact us for enterprise pricing');
      window.location.href = 'mailto:contact@aladdyn.ai';
      return;
    }

    // Paid plans - initiate Razorpay checkout
    setSelectedPlan(plan);
    setTimeout(() => {
      initiatePayment();
    }, 100);
  };

  const formatPrice = (plan: PricingPlan): string => {
    if (plan.price === 0) return 'Free';
    if (plan.price === -1 || plan.name === 'enterprise') return 'Contact';
    return `₹${plan.price}/${plan.interval === 'yearly' ? 'year' : 'month'}`;
  };

  const getButtonText = (plan: PricingPlan): string => {
    if (activeSubscription && activeSubscription.planId === plan.id) {
      return 'Current Plan';
    }
    if (plan.price === 0) return 'Start Free';
    if (plan.price === -1 || plan.name === 'enterprise') return 'Contact Sales';
    return 'Subscribe Now';
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find a plan to power your apps
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Supports teams of all sizes, with pricing that scales with your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.displayName}
              description={getPlanDescription(plan.name)}
              price={formatPrice(plan)}
              features={getPlanFeatures(plan)}
              buttonText={getButtonText(plan)}
              isPopular={plan.name === 'pro'}
              onButtonClick={() => handlePlanSelect(plan)}
              isCurrentPlan={activeSubscription && activeSubscription.planId === plan.id}
            />
          ))}
        </div>

        {activeSubscription && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Currently subscribed to: <span className="font-semibold text-gray-900">{activeSubscription.plan?.displayName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};