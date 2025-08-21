import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';

// This would typically be in a types/ folder
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  cartQuantity: number;
}

const SchoolCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem('school_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem('school_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      const updatedCart = cart.map(item =>
        item.id === productId ? { ...item, cartQuantity: newQuantity } : item
      );
      saveCart(updatedCart);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const shipping = 10.00; // Example fixed shipping
  const total = getSubtotal() + shipping;

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Your <span className="text-primary">Shopping Cart</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-muted-foreground mb-8">Your cart is currently empty.</p>
            <Link to="/school/shop">
              <ModernButton>Continue Shopping</ModernButton>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <ModernCard variant="glass" className="p-6">
                <h2 className="text-2xl font-bold mb-4">Cart Items ({cart.length})</h2>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-muted rounded-md mr-4"></div>
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.cartQuantity - 1)} className="p-2"><Minus className="w-4 h-4" /></button>
                          <span className="px-3">{item.cartQuantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.cartQuantity + 1)} className="p-2"><Plus className="w-4 h-4" /></button>
                        </div>
                        <p className="font-bold w-20 text-right">${(item.price * item.cartQuantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </div>

            {/* Order Summary */}
            <div>
              <ModernCard variant="glass" className="p-6">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
                <Link to="/school/checkout">
                    <ModernButton size="lg" className="w-full mt-6" leftIcon={<CreditCard className="w-5 h-5" />}>
                    Proceed to Checkout
                    </ModernButton>
                </Link>
              </ModernCard>
              <div className="mt-4">
                <Link to="/school/shop">
                    <ModernButton variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                        Continue Shopping
                    </ModernButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolCart;
