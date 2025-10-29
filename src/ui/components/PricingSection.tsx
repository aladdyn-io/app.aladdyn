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
  discountPercentage: number | null;
}

const getPlanDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    freemium: 'Perfect for getting started',
    basic: 'Ideal for small businesses',
    ecommerce: 'Built for online stores',
    pro: 'For growing teams',
    enterprise: 'Enterprise solutions',
  };
  return descriptions[name] || '';
};

const getPlanFeatures = (plan: PricingPlan): string[] => {
  const features: string[] = [];
  
  // Apps
  if (plan.maxApps === 999) {
    features.push('Unlimited apps');
  } else {
    features.push(`${plan.maxApps} ${plan.appType} app${plan.maxApps > 1 ? 's' : ''}`);
  }
  
  // Pages
  if (plan.maxPages === 9999) {
    features.push('Unlimited pages scraping');
  } else if (plan.maxApps > 1) {
    features.push(`${plan.maxPages / plan.maxApps} pages scraping each`);
  } else {
    features.push(`${plan.maxPages} pages scraping`);
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
    features.push('Will have analytics');
    features.push('Will have leads');
  } else if (plan.hasAnalytics) {
    features.push('Will have analytics');
    features.push('No leads');
  } else if (plan.hasLeads) {
    features.push('Will have leads');
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
  const [isYearly, setIsYearly] = useState(false);

  const { initiatePayment } = useRazorpayCheckout({
    planId: selectedPlan?.id || '',
    planName: selectedPlan?.displayName || '',
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
        setPlans(response.data as PricingPlan[]);
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
    return `₹${plan.price.toLocaleString('en-IN')}/${plan.interval === 'yearly' ? 'year' : 'month'}`;
  };

  const calculateSavings = (monthlyPlan: PricingPlan, yearlyPlan: PricingPlan) => {
    const monthlyYearlyTotal = monthlyPlan.price * 12;
    const yearlyPrice = yearlyPlan.price;
    const savings = monthlyYearlyTotal - yearlyPrice;
    const percentage = Math.round((savings / monthlyYearlyTotal) * 100);
    return { savings, percentage };
  };

  // Get the display plans based on the toggle
  const getDisplayPlans = () => {
    // Base plan order
    const basePlanOrder = ['freemium', 'basic', 'ecommerce', 'pro', 'enterprise'];
    
    // Separate monthly and yearly plans
    const monthlyPlans = plans.filter(p => p.interval === 'monthly');
    const yearlyPlans = plans.filter(p => p.interval === 'yearly');
    
    // Create a map for easy lookup
    const monthlyMap = new Map(monthlyPlans.map(p => [p.name, p]));
    const yearlyMap = new Map(yearlyPlans.map(p => [p.name.replace('-yearly', ''), p]));
    
    // Build the display plans array
    return basePlanOrder.map(baseName => {
      const monthlyPlan = monthlyMap.get(baseName);
      const yearlyPlan = yearlyMap.get(baseName);
      
      if (isYearly && yearlyPlan) {
        return yearlyPlan;
      }
      return monthlyPlan;
    }).filter(Boolean) as PricingPlan[];
  };

  const displayPlans = getDisplayPlans();

  // Get savings info for yearly plans
  const getSavingsInfo = (plan: PricingPlan) => {
    if (!isYearly || plan.interval !== 'yearly' || plan.price <= 0) return null;
    
    const baseName = plan.name.replace('-yearly', '');
    const monthlyPlan = plans.find(p => p.name === baseName && p.interval === 'monthly');
    
    if (!monthlyPlan) return null;
    
    return calculateSavings(monthlyPlan, plan);
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
            Choose Your Plan
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className={`text-base font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                isYearly ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-base font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
          </div>
          
          {isYearly && (
            <p className="text-emerald-600 font-semibold text-sm">
              Save 10% with annual billing
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {displayPlans.map((plan) => {
            const savingsInfo = getSavingsInfo(plan);
            const baseName = plan.name.replace('-yearly', '');
            const isYearlyPlan = plan.interval === 'yearly';
            
            return (
              <PricingCard
                key={plan.id}
                title={plan.displayName.replace(' - Annual', '')}
                description={getPlanDescription(baseName)}
                price={formatPrice(plan)}
                features={getPlanFeatures(plan)}
                buttonText={getButtonText(plan)}
                isPopular={baseName === 'pro'}
                onButtonClick={() => handlePlanSelect(plan)}
                isCurrentPlan={activeSubscription && activeSubscription.planId === plan.id}
                badge={isYearlyPlan && plan.discountPercentage ? `${plan.discountPercentage}% off` : undefined}
                savings={savingsInfo ? `Save ${savingsInfo.percentage}% (₹${savingsInfo.savings.toLocaleString('en-IN')})` : undefined}
              />
            );
          })}
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