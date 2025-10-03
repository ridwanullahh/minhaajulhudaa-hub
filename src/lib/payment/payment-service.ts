import config from '../config';
import db from '../db';
import { PaystackProvider } from './providers/paystack';
import { StripeProvider } from './providers/stripe';
import { FlutterwaveProvider } from './providers/flutterwave';

export type PaymentProvider = 'paystack' | 'stripe' | 'flutterwave';
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'refunded';
export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP';

export interface PaymentInitRequest {
  amount: number;
  currency: Currency;
  email: string;
  reference?: string;
  metadata?: Record<string, any>;
  callbackUrl?: string;
  platform: string;
  userId?: string;
}

export interface PaymentInitResponse {
  reference: string;
  authorizationUrl?: string;
  accessCode?: string;
  provider: PaymentProvider;
}

export interface PaymentVerificationResponse {
  status: PaymentStatus;
  reference: string;
  amount: number;
  currency: Currency;
  transactionId: string;
  paidAt?: string;
  metadata?: Record<string, any>;
}

export interface PaymentTransaction {
  id: string;
  uid: string;
  reference: string;
  provider: PaymentProvider;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  platform: string;
  userId?: string;
  email: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface PaymentProviderInterface {
  initializePayment(request: PaymentInitRequest): Promise<PaymentInitResponse>;
  verifyPayment(reference: string): Promise<PaymentVerificationResponse>;
  refundPayment(transactionId: string, amount?: number): Promise<boolean>;
}

class PaymentService {
  private providers: Map<PaymentProvider, PaymentProviderInterface>;

  constructor() {
    this.providers = new Map();
    
    if (config.payment.paystack.publicKey) {
      this.providers.set('paystack', new PaystackProvider(
        config.payment.paystack.publicKey,
        config.payment.paystack.secretKey
      ));
    }
    
    if (config.payment.stripe.publicKey) {
      this.providers.set('stripe', new StripeProvider(
        config.payment.stripe.publicKey,
        config.payment.stripe.secretKey
      ));
    }
    
    if (config.payment.flutterwave.publicKey) {
      this.providers.set('flutterwave', new FlutterwaveProvider(
        config.payment.flutterwave.publicKey,
        config.payment.flutterwave.secretKey
      ));
    }
  }

  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.providers.keys());
  }

  getDefaultProvider(): PaymentProvider | null {
    const providers = this.getAvailableProviders();
    return providers.length > 0 ? providers[0] : null;
  }

  private getProvider(provider: PaymentProvider): PaymentProviderInterface {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Payment provider ${provider} is not configured`);
    }
    return providerInstance;
  }

  async initializePayment(
    provider: PaymentProvider,
    request: PaymentInitRequest
  ): Promise<PaymentInitResponse> {
    const providerInstance = this.getProvider(provider);
    const reference = request.reference || this.generateReference();

    const transaction = await db.insert<PaymentTransaction>('transactions', {
      reference,
      provider,
      amount: request.amount,
      currency: request.currency,
      status: 'pending',
      platform: request.platform,
      userId: request.userId,
      email: request.email,
      metadata: request.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const response = await providerInstance.initializePayment({
      ...request,
      reference: transaction.reference,
    });

    await db.update('transactions', transaction.uid, {
      updatedAt: new Date().toISOString(),
    });

    return response;
  }

  async verifyPayment(provider: PaymentProvider, reference: string): Promise<PaymentVerificationResponse> {
    const providerInstance = this.getProvider(provider);
    const verification = await providerInstance.verifyPayment(reference);

    const transactions = await db.get<PaymentTransaction>('transactions');
    const transaction = transactions.find(t => t.reference === reference);

    if (transaction) {
      await db.update('transactions', transaction.uid, {
        status: verification.status,
        transactionId: verification.transactionId,
        paidAt: verification.paidAt,
        updatedAt: new Date().toISOString(),
      });
    }

    return verification;
  }

  async refundPayment(
    provider: PaymentProvider,
    reference: string,
    amount?: number
  ): Promise<boolean> {
    const transactions = await db.get<PaymentTransaction>('transactions');
    const transaction = transactions.find(t => t.reference === reference);

    if (!transaction || !transaction.transactionId) {
      throw new Error('Transaction not found or not completed');
    }

    const providerInstance = this.getProvider(provider);
    const refunded = await providerInstance.refundPayment(transaction.transactionId, amount);

    if (refunded) {
      await db.update('transactions', transaction.uid, {
        status: 'refunded',
        updatedAt: new Date().toISOString(),
      });
    }

    return refunded;
  }

  async getTransaction(reference: string): Promise<PaymentTransaction | null> {
    const transactions = await db.get<PaymentTransaction>('transactions');
    return transactions.find(t => t.reference === reference) || null;
  }

  async getTransactionsByUser(userId: string): Promise<PaymentTransaction[]> {
    const transactions = await db.get<PaymentTransaction>('transactions');
    return transactions.filter(t => t.userId === userId);
  }

  async getTransactionsByPlatform(platform: string): Promise<PaymentTransaction[]> {
    const transactions = await db.get<PaymentTransaction>('transactions');
    return transactions.filter(t => t.platform === platform);
  }

  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `REF-${timestamp}-${random}`.toUpperCase();
  }
}

export const paymentService = new PaymentService();
export default paymentService;
