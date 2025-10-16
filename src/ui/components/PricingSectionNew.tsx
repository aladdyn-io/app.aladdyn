"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

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
  unlimitedChat: boolean;
  discountPercentage: number | null;
  isActive: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function PricingSectionNew() {
  const [isYearly, setIsYearly] = useState(false)
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPricingPlans()
  }, [])

  const fetchPricingPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/plans`)
      const data = await response.json()
      
      if (data.success) {
        // Sort plans by price (excluding -1 for Enterprise)
        const sortedPlans = data.data.sort((a: PricingPlan, b: PricingPlan) => {
          if (a.price === -1) return 1 // Enterprise goes last
          if (b.price === -1) return -1
          return a.price - b.price
        })
        setPricingPlans(sortedPlans)
      } else {
        setError(data.error || 'Failed to fetch pricing plans')
      }
    } catch (err) {
      setError('Failed to fetch pricing plans')
      console.error('Error fetching pricing plans:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPlanFeatures = (plan: PricingPlan) => {
    const features = []
    
    // App limit
    if (plan.maxApps === 1) {
      features.push(`${plan.maxApps} ${plan.appType} app`)
    } else if (plan.maxApps === 999) {
      features.push('Unlimited apps')
    } else {
      features.push(`${plan.maxApps} ${plan.appType} apps`)
    }
    
    // Page scraping
    if (plan.maxPages === 10) {
      features.push(`${plan.maxPages} page scraping`)
    } else if (plan.maxPages === 35) {
      features.push(`${plan.maxPages} pages scraping`)
    } else if (plan.maxPages === 175) {
      features.push(`${plan.maxPages} pages scraping each`)
    } else {
      features.push('Unlimited page scraping')
    }
    
    // Shopify integration
    if (plan.hasShopify) {
      features.push('Shopify Integration')
    }
    
    // Retraining
    if (plan.retrainAllowed) {
      features.push('Unlimited retrain')
    } else {
      features.push('Retrain NOT ALLOWED')
    }
    
    // Chat features
    if (plan.freeChats) {
      features.push(`${plan.freeChats} chat - without login`)
    }
    if (plan.unlimitedChat) {
      features.push('Unlimited chat')
    }
    
    // Analytics and leads
    if (plan.hasAnalytics && plan.hasLeads) {
      features.push('Will have analytics', 'Will have leads')
    } else if (plan.hasAnalytics) {
      features.push('Will have analytics')
    } else if (plan.hasLeads) {
      features.push('Will have leads')
    } else {
      features.push('No analytics and leads')
    }
    
    return features
  }

  const getDisplayPrice = (plan: PricingPlan) => {
    if (plan.price === -1) {
      return 'Contact'
    }
    
    if (isYearly) {
      // Calculate yearly price with 2 months free (17% discount)
      const yearlyPrice = Math.round(plan.price * 10) // 10 months instead of 12
      return `₹${yearlyPrice}`
    }
    
    return `₹${plan.price}`
  }

  const getYearlyDiscount = (plan: PricingPlan) => {
    if (plan.price === -1 || !isYearly) {
      return null
    }
    
    const monthlyYearly = plan.price * 12
    const discountedYearly = Math.round(plan.price * 10)
    const savings = monthlyYearly - discountedYearly
    const percentage = Math.round((savings / monthlyYearly) * 100)
    
    return { savings, percentage }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Pricing</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-24 px-4" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 id="pricing-heading" className="text-4xl font-bold text-balance mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>

          {/* Toggle */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm font-medium w-16 text-center ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
                id="monthly-label"
              >
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isYearly ? "bg-primary" : "bg-muted"
                }`}
                role="switch"
                aria-checked={isYearly}
                aria-label="Toggle between monthly and yearly billing"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? "translate-x-6" : "translate-x-1"
                  }`}
                  aria-hidden="true"
                />
              </button>
              <span
                className={`text-sm font-medium w-16 text-center ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
                id="yearly-label"
              >
                Yearly
              </span>
            </div>
            <div className="min-h-[24px] flex justify-center">
              {isYearly && (
                <Badge variant="secondary" aria-label="17% savings with yearly billing">
                  Save 17%
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto" role="list" aria-label="Pricing plans">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col h-[600px] ${plan.name === 'pro' ? "border-primary shadow-lg scale-105" : ""}`}
              role="listitem"
              aria-labelledby={`plan-${index}-title`}
              aria-describedby={`plan-${index}-description plan-${index}-price`}
            >
              {plan.name === 'pro' && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" aria-label="Most popular plan">
                  Most Popular
                </Badge>
              )}
              
              {plan.discountPercentage && plan.discountPercentage > 0 && (
                <Badge className="absolute -top-3 right-4 bg-green-500" aria-label={`${plan.discountPercentage}% discount`}>
                  {plan.discountPercentage}% off
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold" id={`plan-${index}-title`}>
                  {plan.displayName}
                </CardTitle>
                <CardDescription className="text-balance" id={`plan-${index}-description`}>
                  {plan.name === 'freemium' ? 'Perfect for getting started' :
                   plan.name === 'basic' ? 'Ideal for small businesses' :
                   plan.name === 'ecommerce' ? 'Built for online stores' :
                   plan.name === 'pro' ? 'For growing teams' :
                   'Enterprise solutions'}
                </CardDescription>
                <div className="mt-4" id={`plan-${index}-price`}>
                  <span
                    className="text-4xl font-bold"
                    aria-label={`${getDisplayPrice(plan)} per ${isYearly ? 'year' : plan.interval}`}
                  >
                    {getDisplayPrice(plan)}
                  </span>
                  {plan.price !== -1 && (
                    <span className="text-muted-foreground" aria-hidden="true">
                      /{isYearly ? 'year' : plan.interval}
                    </span>
                  )}
                  
                  {/* Show plan-specific discount */}
                  {plan.discountPercentage && plan.discountPercentage > 0 && !isYearly && (
                    <div
                      className="text-sm text-green-600 mt-1 font-medium"
                      aria-label={`${plan.discountPercentage}% discount applied`}
                    >
                      Save {plan.discountPercentage}%
                    </div>
                  )}
                  
                  {/* Show yearly savings */}
                  {isYearly && plan.price !== -1 && (
                    (() => {
                      const yearlyDiscount = getYearlyDiscount(plan)
                      return yearlyDiscount && (
                        <div
                          className="text-sm text-green-600 mt-1 font-medium"
                          aria-label={`Save ${yearlyDiscount.savings} rupees with yearly billing`}
                        >
                          Save {yearlyDiscount.percentage}% (₹{yearlyDiscount.savings})
                        </div>
                      )
                    })()
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3" aria-label={`${plan.displayName} plan features`}>
                  {getPlanFeatures(plan).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.name !== 'pro'
                      ? "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
                      : ""
                  }`}
                  variant={plan.name === 'pro' ? "default" : "outline"}
                  size="lg"
                  aria-label={`Get started with ${plan.displayName} plan for ${getDisplayPrice(plan)} per ${plan.interval}`}
                  onClick={() => {
                    if (plan.price === -1) {
                      // Handle Enterprise contact
                      window.location.href = 'mailto:sales@example.com?subject=Enterprise Plan Inquiry'
                    } else {
                      // Handle other plans
                      console.log('Selected plan:', plan.name)
                    }
                  }}
                >
                  {plan.price === -1 ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground">All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  )
}
