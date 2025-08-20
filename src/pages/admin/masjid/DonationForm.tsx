import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const DonationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    amount: 0,
    campaign: 'general',
    donorEmail: '',
    status: 'completed'
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await masjidDB.get('donations');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setItem(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const dataToSave = { ...item, amount: Number(item.amount) || 0, createdAt: new Date().toISOString() };
    try {
      if (isEditing) {
        await masjidDB.update('donations', id, dataToSave);
      } else {
        await masjidDB.insert('donations', dataToSave);
      }
      navigate('/masjid/admin/donations');
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
        <Link to="/masjid/admin/donations">
            <ModernButton variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4" />
            </ModernButton>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Donation' : 'Log New Donation'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Amount</Label><Input name="amount" type="number" value={item.amount} onChange={handleChange} required /></div>
            <div><Label>Donor Email</Label><Input name="donorEmail" type="email" value={item.donorEmail} onChange={handleChange} /></div>
            <div><Label>Campaign</Label><Input name="campaign" value={item.campaign} onChange={handleChange} /></div>
            <div><Label>Status</Label><Input name="status" value={item.status} onChange={handleChange} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Donation'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default DonationForm;
