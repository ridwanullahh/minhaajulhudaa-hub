import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const AdmissionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [admission, setAdmission] = useState({
    studentName: '',
    grade: '',
    parentName: '',
    parentEmail: '',
    status: 'pending',
    applicationDate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await schoolDB.get('admissions');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setAdmission(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmission(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAdmission(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await schoolDB.update('admissions', id, admission);
      } else {
        await schoolDB.insert('admissions', admission);
      }
      navigate('/school/admin/admissions');
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
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/admissions')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Admission' : 'New Admission Application'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Student Name</Label><Input name="studentName" value={admission.studentName} onChange={handleChange} required /></div>
            <div><Label>Grade/Class Applying For</Label><Input name="grade" value={admission.grade} onChange={handleChange} required /></div>
            <div><Label>Parent Name</Label><Input name="parentName" value={admission.parentName} onChange={handleChange} required /></div>
            <div><Label>Parent Email</Label><Input name="parentEmail" type="email" value={admission.parentEmail} onChange={handleChange} required /></div>
            <div>
                <Label>Status</Label>
                <Select name="status" value={admission.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Admission'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default AdmissionForm;
