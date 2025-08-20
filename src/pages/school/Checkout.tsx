import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  cartQuantity: number;
}

const SchoolCheckout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('school_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const shipping = 10.00;
  const total = getSubtotal() + shipping;

  const handlePlaceOrder = () => {
    // In a real application, this would:
    // 1. Send the cart data to a backend.
    // 2. Process payment via a payment gateway (Stripe, Paystack, etc.).
    // 3. On success, create an order record in the database.
    // 4. Clear the local storage cart.
    console.log("Placing order with items:", cart);
    localStorage.removeItem('school_cart');
    setIsOrderPlaced(true);
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center text-center">
        <ModernCard variant="glass" className="p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-8">Thank you for your purchase. A confirmation has been sent to your email.</p>
          <Link to="/school">
            <ModernButton>Back to School Home</ModernButton>
          </Link>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <ModernCard variant="glass" className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Order</h2>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.cartQuantity}</span>
                  <span>${(item.price * item.cartQuantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </ModernCard>

          {/* Checkout Form */}
          <ModernCard variant="glass" className="p-6">
            <h2 className="text-2xl font-bold mb-4">Shipping & Payment</h2>
            <p className="text-muted-foreground mb-6">This is a placeholder for the shipping address and payment form.</p>
            <div className="space-y-4">
                {/* A real form would go here */}
                <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Shipping Address Form</div>
                <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Payment Details Form</div>
            </div>
            <ModernButton size="lg" className="w-full mt-6" onClick={handlePlaceOrder}>
              Place Order
            </ModernButton>
          </ModernCard>
        </div>
        <div className="mt-8">
          <Link to="/school/cart">
            <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Cart
            </ModernButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchoolCheckout;
