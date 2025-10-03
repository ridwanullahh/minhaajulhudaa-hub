import type {
  PaymentProviderInterface,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentVerificationResponse,
  PaymentStatus,
} from '../payment-service';

export class StripeProvider implements PaymentProviderInterface {
  private publicKey: string;
  private secretKey: string;
  private baseUrl = 'https://api.stripe.com/v1';

  constructor(publicKey: string, secretKey: string) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
  }

  async initializePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    const params = new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': request.currency.toLowerCase(),
      'line_items[0][price_data][product_data][name]': 'Payment',
      'line_items[0][price_data][unit_amount]': (request.amount * 100).toString(),
      'line_items[0][quantity]': '1',
      mode: 'payment',
      success_url: request.callbackUrl || `${window.location.origin}/payment/success?reference=${request.reference}`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      'metadata[reference]': request.reference || '',
    });

    if (request.metadata) {
      Object.entries(request.metadata).forEach(([key, value]) => {
        params.append(`metadata[${key}]`, String(value));
      });
    }

    const response = await fetch(`${this.baseUrl}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('Failed to initialize Stripe payment');
    }

    const data = await response.json();

    return {
      reference: request.reference!,
      authorizationUrl: data.url,
      provider: 'stripe',
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    const response = await fetch(
      `${this.baseUrl}/checkout/sessions?limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify Stripe payment');
    }

    const data = await response.json();
    const session = data.data.find((s: any) => s.metadata?.reference === reference);

    if (!session) {
      return {
        status: 'pending',
        reference,
        amount: 0,
        currency: 'USD',
        transactionId: '',
      };
    }

    let status: PaymentStatus = 'pending';
    if (session.payment_status === 'paid') {
      status = 'success';
    } else if (session.payment_status === 'unpaid') {
      status = 'failed';
    }

    return {
      status,
      reference,
      amount: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
      transactionId: session.id,
      metadata: session.metadata,
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    const params = new URLSearchParams({
      charge: transactionId,
    });

    if (amount) {
      params.append('amount', (amount * 100).toString());
    }

    const response = await fetch(`${this.baseUrl}/refunds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === 'succeeded';
  }
}
