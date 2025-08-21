import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const StaffForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await schoolDB.get('staff');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setStaff(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await schoolDB.update('staff', id, staff);
      } else {
        await schoolDB.insert('staff', staff);
      }
      navigate('/school/admin/staff');
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
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/staff')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Name</Label><Input name="name" value={staff.name} onChange={handleChange} required /></div>
            <div><Label>Role/Position</Label><Input name="role" value={staff.role} onChange={handleChange} required /></div>
            <div><Label>Email</Label><Input name="email" type="email" value={staff.email} onChange={handleChange} /></div>
            <div><Label>Phone</Label><Input name="phone" value={staff.phone} onChange={handleChange} /></div>
            <div className="md:col-span-2"><Label>Biography</Label><Textarea name="bio" value={staff.bio} onChange={handleChange} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Staff Member'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default StaffForm;
