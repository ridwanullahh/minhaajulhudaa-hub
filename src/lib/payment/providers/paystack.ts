import type {
  PaymentProviderInterface,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentVerificationResponse,
  PaymentStatus,
} from '../payment-service';

export class PaystackProvider implements PaymentProviderInterface {
  private publicKey: string;
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor(publicKey: string, secretKey: string) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
  }

  async initializePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: request.email,
        amount: request.amount * 100,
        currency: request.currency,
        reference: request.reference,
        callback_url: request.callbackUrl,
        metadata: request.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize Paystack payment');
    }

    const data = await response.json();

    return {
      reference: request.reference!,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      provider: 'paystack',
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify Paystack payment');
    }

    const data = await response.json();
    const transaction = data.data;

    let status: PaymentStatus = 'pending';
    if (transaction.status === 'success') {
      status = 'success';
    } else if (transaction.status === 'failed') {
      status = 'failed';
    }

    return {
      status,
      reference: transaction.reference,
      amount: transaction.amount / 100,
      currency: transaction.currency,
      transactionId: transaction.id.toString(),
      paidAt: transaction.paid_at,
      metadata: transaction.metadata,
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    const body: any = {
      transaction: transactionId,
    };

    if (amount) {
      body.amount = amount * 100;
    }

    const response = await fetch(`${this.baseUrl}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === true;
  }
}
