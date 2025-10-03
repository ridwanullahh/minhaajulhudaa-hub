import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import paymentService, { PaymentProvider, Currency } from '@/lib/payment';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency: Currency;
  email: string;
  platform: string;
  userId?: string;
  metadata?: Record<string, any>;
  onSuccess?: (reference: string) => void;
  onError?: (error: Error) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  amount: initialAmount,
  currency: initialCurrency,
  email,
  platform,
  userId,
  metadata,
  onSuccess,
  onError,
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [provider, setProvider] = useState<PaymentProvider | ''>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const availableProviders = paymentService.getAvailableProviders();

  const handlePayment = async () => {
    if (!provider) {
      toast({
        title: 'Error',
        description: 'Please select a payment provider',
        variant: 'destructive',
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: 'Error',
        description: 'Amount must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await paymentService.initializePayment(provider, {
        amount,
        currency,
        email,
        platform,
        userId,
        metadata,
        callbackUrl: `${window.location.origin}/payment/callback`,
      });

      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      }

      if (onSuccess) {
        onSuccess(response.reference);
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to initialize payment',
        variant: 'destructive',
      });

      if (onError) {
        onError(error as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method and complete the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">NGN (₦)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="provider">Payment Provider</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as PaymentProvider)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment provider" />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Email: {email}</p>
            <p>Platform: {platform}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={loading || !provider}>
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
