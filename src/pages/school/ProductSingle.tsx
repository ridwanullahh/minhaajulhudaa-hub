import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { schoolDB } from '@/lib/platform-db';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Package } from 'lucide-react';

const SchoolProductSingle = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        setIsLoading(true);
        try {
          // This is inefficient, but we'll use it for now.
          // A better approach would be a direct DB lookup by ID.
          const allProducts = await schoolDB.get('shop_products');
          const foundProduct = allProducts.find(p => p.id === id);
          setProduct(foundProduct);
        } catch (error) {
          console.error('Error loading product:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadProduct();
    }
  }, [id]);

  // Dummy addToCart function. This should be connected to a global state/context later.
  const addToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    // In a real app, this would dispatch an action to a global cart context/store
    // and likely show a toast notification.
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <Link to="/school/shop">
          <ModernButton>Back to Shop</ModernButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/school/shop">
            <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Shop
            </ModernButton>
          </Link>
        </div>

        <ModernCard variant="glass" className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center p-8">
                <Package className="w-48 h-48 text-primary/30" />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">({product.reviews} reviews)</span>
              </div>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              <div className="text-4xl font-bold text-primary mb-6">
                ${product.price.toFixed(2)}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="p-2">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <ModernButton
                size="lg"
                className="w-full"
                onClick={addToCart}
                disabled={!product.inStock}
                leftIcon={<ShoppingCart className="w-5 h-5" />}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </ModernButton>
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default SchoolProductSingle;
