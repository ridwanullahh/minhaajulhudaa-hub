import db from '../db';
import paymentService from '../payment';

export interface Product {
  id: string;
  uid: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  platform: string;
  category: string;
  images: string[];
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  featured: boolean;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  uid: string;
  customerId: string;
  platform: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  createdAt: string;
}

export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}

class EcommerceService {
  async getProducts(platform: string, filters?: {
    category?: string;
    featured?: boolean;
    status?: string;
  }): Promise<Product[]> {
    let products = await db.get<Product>('products');
    products = products.filter(p => p.platform === platform);

    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters?.featured !== undefined) {
      products = products.filter(p => p.featured === filters.featured);
    }
    if (filters?.status) {
      products = products.filter(p => p.status === filters.status);
    }

    return products;
  }

  async getProduct(productId: string): Promise<Product | null> {
    const products = await db.get<Product>('products');
    return products.find(p => p.id === productId || p.uid === productId) || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'uid' | 'createdAt'>): Promise<Product> {
    return await db.insert<Product>('products', {
      ...productData,
      createdAt: new Date().toISOString(),
    });
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    return await db.update<Product>('products', productId, updates);
  }

  async deleteProduct(productId: string): Promise<void> {
    await db.delete('products', productId);
  }

  async createOrder(orderData: {
    customerId: string;
    platform: string;
    items: CartItem[];
    shippingAddress: Address;
    billingAddress: Address;
  }): Promise<Order> {
    const products = await db.get<Product>('products');
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const product = products.find(p => p.id === item.productId || p.uid === item.productId);
      if (!product) continue;

      const total = item.price * item.quantity;
      subtotal += total;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        total,
      });
    }

    const tax = subtotal * 0.075;
    const shipping = subtotal > 100 ? 0 : 10;
    const discount = 0;
    const total = subtotal + tax + shipping - discount;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    return await db.insert<Order>('orders', {
      customerId: orderData.customerId,
      platform: orderData.platform,
      orderNumber,
      total,
      subtotal,
      tax,
      shipping,
      discount,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      items: orderItems,
      createdAt: new Date().toISOString(),
    });
  }

  async getOrders(customerId: string): Promise<Order[]> {
    const orders = await db.get<Order>('orders');
    return orders.filter(o => o.customerId === customerId);
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const orders = await db.get<Order>('orders');
    return orders.find(o => o.id === orderId || o.uid === orderId) || null;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return await db.update<Order>('orders', orderId, { status });
  }

  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<Order> {
    return await db.update<Order>('orders', orderId, { paymentStatus });
  }

  async reduceStock(productId: string, quantity: number): Promise<void> {
    const product = await this.getProduct(productId);
    if (product) {
      const newStock = Math.max(0, product.stock - quantity);
      await this.updateProduct(productId, {
        stock: newStock,
        status: newStock === 0 ? 'out-of-stock' : product.status,
      });
    }
  }
}

export const ecommerceService = new EcommerceService();
export default ecommerceService;
