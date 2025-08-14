import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  ShoppingCart,
  Search,
  Filter,
  Star,
  Plus,
  Minus,
  Heart,
  Eye,
  Package,
  Truck,
  Shield,
  CreditCard
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  quantity: number;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  cartQuantity: number;
}

const SchoolShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await schoolDB.get('shop_products');
      if (data.length === 0) {
        // Initialize with sample products
        const sampleProducts = [
          {
            name: 'School Uniform - Boys',
            description: 'Complete school uniform set for boys including shirt, pants, and tie',
            price: 45.99,
            category: 'uniforms',
            image: '/images/boys-uniform.jpg',
            inStock: true,
            quantity: 50,
            rating: 4.8,
            reviews: 24
          },
          {
            name: 'School Uniform - Girls',
            description: 'Complete school uniform set for girls including blouse, skirt, and hijab',
            price: 49.99,
            category: 'uniforms',
            image: '/images/girls-uniform.jpg',
            inStock: true,
            quantity: 45,
            rating: 4.9,
            reviews: 31
          },
          {
            name: 'Islamic Studies Textbook',
            description: 'Comprehensive Islamic Studies textbook for Grade 5-8',
            price: 24.99,
            category: 'books',
            image: '/images/islamic-textbook.jpg',
            inStock: true,
            quantity: 100,
            rating: 4.7,
            reviews: 18
          },
          {
            name: 'Arabic Workbook Set',
            description: 'Complete Arabic language workbook series (3 books)',
            price: 34.99,
            category: 'books',
            image: '/images/arabic-workbook.jpg',
            inStock: true,
            quantity: 75,
            rating: 4.6,
            reviews: 22
          },
          {
            name: 'School Backpack',
            description: 'Durable school backpack with Islamic design',
            price: 29.99,
            category: 'supplies',
            image: '/images/school-backpack.jpg',
            inStock: true,
            quantity: 30,
            rating: 4.5,
            reviews: 15
          },
          {
            name: 'Prayer Mat - Student Size',
            description: 'Compact prayer mat perfect for school prayers',
            price: 19.99,
            category: 'supplies',
            image: '/images/prayer-mat.jpg',
            inStock: true,
            quantity: 60,
            rating: 4.8,
            reviews: 27
          }
        ];

        for (const product of sampleProducts) {
          await schoolDB.insert('shop_products', product);
        }
        setProducts(sampleProducts as Product[]);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('school_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem('school_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
      saveCart(updatedCart);
    } else {
      const newCart = [...cart, { ...product, cartQuantity: 1 }];
      saveCart(newCart);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'uniforms', name: 'Uniforms' },
    { id: 'books', name: 'Books' },
    { id: 'supplies', name: 'School Supplies' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            School <span className="text-platform-primary">Shop</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Everything you need for your Islamic education journey. From uniforms to books,
            we have all the essentials for our students.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-platform-primary text-white px-4 py-3 rounded-lg">
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="font-medium">Cart ({getCartItemCount()})</span>
            <span className="ml-2 font-bold">${getCartTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProducts.map((product) => (
            <ModernCard key={product.id} variant="glass" className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-t-xl mb-4 relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-platform-primary/10 to-platform-secondary/10 flex items-center justify-center">
                  <Package className="w-16 h-16 text-platform-primary/30" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-platform-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    product.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                <ModernButton
                  className="w-full"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  leftIcon={<ShoppingCart className="w-4 h-4" />}
                >
                  Add to Cart
                </ModernButton>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolShop;