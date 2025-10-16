import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import api from '@/services/api';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    id: string;
    displayName: string;
    price: number;
    currency: string;
    interval: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
  createdAt: string;
  subscription?: {
    plan: {
      displayName: string;
    };
  };
}

export function SubscriptionManagement() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const [subResponse, paymentsResponse] = await Promise.all([
        api.getActiveSubscription(),
        api.getPaymentHistory(10)
      ]);

      if (subResponse.success && subResponse.data) {
        setSubscription(subResponse.data);
      }

      if (paymentsResponse.success && paymentsResponse.data) {
        setPayments(paymentsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      if (!subscription) return;

      const response = await api.cancelSubscription(subscription.id, false);
      
      if (response.success) {
        toast.success('Subscription will be cancelled at the end of the billing period');
        setSubscription(response.data);
        setCancelDialogOpen(false);
      }
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      ACTIVE: { variant: 'default', label: 'Active' },
      TRIAL: { variant: 'secondary', label: 'Trial' },
      CANCELLED: { variant: 'destructive', label: 'Cancelled' },
      EXPIRED: { variant: 'outline', label: 'Expired' },
      PENDING: { variant: 'outline', label: 'Pending' },
    };

    const config = statusConfig[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusIcon = (status: string) => {
    if (status === 'SUCCESS') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription. Choose a plan to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Subscribe to a plan to unlock all features and start building your AI chatbots.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/pricing')} className="w-full">
            View Pricing Plans
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Plan</p>
                <p className="text-lg font-semibold text-blue-600">{subscription.plan.displayName}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(subscription.plan.price, subscription.plan.currency)}/{subscription.plan.interval}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Billing Period</p>
                <p className="text-sm text-gray-600">
                  {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be cancelled on {formatDate(subscription.currentPeriodEnd)}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/pricing')}>
            Change Plan
          </Button>
          {!subscription.cancelAtPeriodEnd && subscription.status === 'ACTIVE' && (
            <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
              Cancel Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No payment history available</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div key={payment.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getPaymentStatusIcon(payment.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.subscription?.plan.displayName || 'Payment'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.paidAt || payment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <Badge variant={payment.status === 'SUCCESS' ? 'default' : 'destructive'} className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={cancelling}>
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SubscriptionManagement;

