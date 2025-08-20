import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    inStock: true,
    quantity: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await schoolDB.get('shop_products');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setProduct(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProduct(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const dataToSave = {
        ...product,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 0,
    };
    try {
      if (isEditing) {
        await schoolDB.update('shop_products', id, dataToSave);
      } else {
        await schoolDB.insert('shop_products', dataToSave);
      }
      navigate('/school/admin/shop/products');
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/shop/products')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><Label>Product Name</Label><Input name="name" value={product.name} onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" value={product.description} onChange={handleChange} /></div>
            <div><Label>Price</Label><Input name="price" type="number" value={product.price} onChange={handleChange} required /></div>
            <div><Label>Category</Label><Input name="category" value={product.category} onChange={handleChange} /></div>
            <div><Label>Quantity in Stock</Label><Input name="quantity" type="number" value={product.quantity} onChange={handleChange} /></div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="inStock">In Stock</Label>
                <Switch id="inStock" name="inStock" checked={product.inStock} onCheckedChange={(checked) => handleSwitchChange('inStock', checked)} />
            </div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Product'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default ProductForm;
