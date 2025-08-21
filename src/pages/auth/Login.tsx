import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// This hook will be created next
// import { useUserAuth } from '@/hooks/useUserAuth';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { login } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const platform = from.split('/')[1] || 'school';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // const success = await login(email, password);
    // if (success) {
    //   navigate(from, { replace: true });
    // } else {
    //   setError('Invalid credentials. Please try again.');
    // }
    alert("Login functionality coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <ModernCard variant="glass" className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">User Login</h1>
         <p className="text-center text-muted-foreground mb-6">
          Welcome back to Minhaajulhudaa <span className="capitalize font-semibold text-primary">{platform}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <ModernButton type="submit" className="w-full">Login</ModernButton>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to={`/${platform}/register`} className="text-primary hover:underline">Register here</Link>
          </p>
        </form>
      </ModernCard>
    </div>
  );
};

export default UserLogin;
