import React, { useState, useEffect } from 'react';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PortalProfile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const studentId = '1'; // This would be dynamic based on auth

  useEffect(() => {
    // In a real app, we would fetch the logged-in user's data.
    // For now, we'll fetch a specific student as a demo.
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const foundUser = await schoolDB.find('students', { id: studentId });
        if (foundUser.length > 0) {
          setUser(foundUser[0]);
        } else {
            // If no student found, create one for demo
            const demoStudent = await schoolDB.insert('students', {id: studentId, name: 'Demo Student', email: 'student@example.com'});
            setUser(demoStudent);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await schoolDB.update('students', studentId, user);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading) return <div>Loading Profile...</div>

  return (
    <div>
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>
        <ModernCard>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={user.name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" value={user.email} onChange={handleChange} />
                    </div>
                </div>
                <div className="p-6 border-t">
                    <ModernButton type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Update Profile'}
                    </ModernButton>
                </div>
            </form>
        </ModernCard>
    </div>
  );
};

export default PortalProfile;
