import React from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePlatform } from '@/hooks/usePlatform';

const SchoolContact = () => {
    const { config, isLoadingSettings } = usePlatform();
    const handleSubmit = (e) => { e.preventDefault(); alert("Message sent!"); };
    const contactDetails = [
      { icon: <MapPin/>, title: "Our Address", value: config.address },
      { icon: <Phone/>, title: "Call Us", value: config.phone },
      { icon: <Mail/>, title: "Email Us", value: config.email },
    ];
    return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16"><h1 className="text-4xl lg:text-6xl font-bold">Contact Us</h1></div>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ModernCard variant="glass" className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div><Label>Full Name</Label><Input required /></div>
                    <div><Label>Email</Label><Input type="email" required /></div>
                    <div><Label>Message</Label><Textarea rows={6} required /></div>
                    <ModernButton type="submit" className="w-full" size="lg">Send</ModernButton>
                </form>
            </ModernCard>
            <div className="space-y-8">
                {isLoadingSettings ? <p>Loading...</p> : contactDetails.map(d => (
                    d.value && <ModernCard key={d.title} className="p-6 flex items-center">
                        <div className="text-primary mr-6">{React.cloneElement(d.icon, { className: "w-8 h-8" })}</div>
                        <div><h3 className="text-xl font-semibold">{d.title}</h3><p>{d.value}</p></div>
                    </ModernCard>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
export default SchoolContact;
