import { useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/services/api';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  image?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  planId: string;
  planName: string;
  amount: number;
  onSuccess: (subscription: any) => void;
  onError?: (error: Error) => void;
}

export function useRazorpayCheckout({
  planId,
  planName,
  amount,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async () => {
    try {
      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        return;
      }

      // Create order
      const orderResponse = await api.createPaymentOrder(planId);
      
      if (!orderResponse.success || !orderResponse.data) {
        throw new Error('Failed to create payment order');
      }

      const { orderId, amount: orderAmount, currency, razorpayKeyId } = orderResponse.data;

      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: orderAmount,
        currency: currency,
        order_id: orderId,
        name: 'Aladdyn AI',
        description: `Subscription to ${planName}`,
        image: '/gene.png', // Your logo
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await api.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              planId
            );

            if (verifyResponse.success && verifyResponse.data) {
              toast.success('Payment successful! Your subscription is now active.');
              onSuccess(verifyResponse.data.subscription);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            if (onError) {
              onError(error as Error);
            }
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: '#3B82F6', // Blue color
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
        if (onError) {
          onError(new Error(response.error.description));
        }
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      if (onError) {
        onError(error as Error);
      }
    }
  };

  return { initiatePayment };
}

export default useRazorpayCheckout;

