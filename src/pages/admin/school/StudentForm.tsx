import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const StudentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: '',
    email: '',
    class: '',
    enrollmentDate: new Date().toISOString().split('T')[0], // Default to today
    status: 'active',
    parentContact: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadStudent();
    }
  }, [id, isEditing]);

  const loadStudent = async () => {
    setIsLoading(true);
    try {
      const allStudents = await schoolDB.get('students');
      const foundStudent = allStudents.find(s => s.id === id);
      if (foundStudent) {
        setStudent({
            ...foundStudent,
            enrollmentDate: new Date(foundStudent.enrollmentDate).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error("Error loading student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        await schoolDB.update('students', id, student);
      } else {
        await schoolDB.insert('students', student);
      }
      navigate('/school/admin/students');
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student record.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/students')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Student Record' : 'Add New Student'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={student.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={student.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Input id="class" name="class" value={student.class} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="enrollmentDate">Enrollment Date</Label>
              <Input id="enrollmentDate" name="enrollmentDate" type="date" value={student.enrollmentDate} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="parentContact">Parent Contact</Label>
              <Input id="parentContact" name="parentContact" value={student.parentContact} onChange={handleChange} />
            </div>
             <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={student.address} onChange={handleChange} />
            </div>
          </div>
          <div className="p-6 border-t">
            <ModernButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Student Record'}
            </ModernButton>
          </div>
        </ModernCard>
      </form>
    </div>
  );
};

export default StudentForm;
