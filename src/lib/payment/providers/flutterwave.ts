import type {
  PaymentProviderInterface,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentVerificationResponse,
  PaymentStatus,
} from '../payment-service';

export class FlutterwaveProvider implements PaymentProviderInterface {
  private publicKey: string;
  private secretKey: string;
  private baseUrl = 'https://api.flutterwave.com/v3';

  constructor(publicKey: string, secretKey: string) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
  }

  async initializePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: request.reference,
        amount: request.amount,
        currency: request.currency,
        redirect_url: request.callbackUrl || `${window.location.origin}/payment/callback`,
        customer: {
          email: request.email,
        },
        customizations: {
          title: 'Payment',
          description: 'Payment transaction',
        },
        meta: request.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize Flutterwave payment');
    }

    const data = await response.json();

    return {
      reference: request.reference!,
      authorizationUrl: data.data.link,
      provider: 'flutterwave',
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    const response = await fetch(`${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`, {
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify Flutterwave payment');
    }

    const data = await response.json();
    const transaction = data.data;

    let status: PaymentStatus = 'pending';
    if (transaction.status === 'successful') {
      status = 'success';
    } else if (transaction.status === 'failed') {
      status = 'failed';
    }

    return {
      status,
      reference: transaction.tx_ref,
      amount: transaction.amount,
      currency: transaction.currency,
      transactionId: transaction.id.toString(),
      paidAt: transaction.created_at,
      metadata: transaction.meta,
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/transactions/${transactionId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === 'success';
  }
}
