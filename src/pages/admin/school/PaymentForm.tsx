import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const PaymentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    studentId: '',
    amount: 0,
    method: 'Credit Card',
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await schoolDB.get('payments');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setPayment(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const dataToSave = { ...payment, amount: Number(payment.amount) || 0 };
    try {
      if (isEditing) {
        await schoolDB.update('payments', id, dataToSave);
      } else {
        await schoolDB.insert('payments', dataToSave);
      }
      navigate('/school/admin/payments');
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
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/payments')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Payment' : 'Log New Payment'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Student ID</Label><Input name="studentId" value={payment.studentId} onChange={handleChange} required /></div>
            <div><Label>Amount</Label><Input name="amount" type="number" value={payment.amount} onChange={handleChange} required /></div>
            <div><Label>Description</Label><Input name="description" value={payment.description} onChange={handleChange} /></div>
            <div><Label>Payment Date</Label><Input name="date" type="date" value={payment.date} onChange={handleChange} required /></div>
            <div>
                <Label>Payment Method</Label>
                <Select name="method" value={payment.method} onValueChange={(value) => handleSelectChange('method', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Status</Label>
                <Select name="status" value={payment.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Payment'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default PaymentForm;
