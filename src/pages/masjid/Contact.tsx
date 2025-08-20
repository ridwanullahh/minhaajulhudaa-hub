import React from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

const MasjidContact = () => {

  // Dummy handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message. We will get back to you shortly.");
  };

  const contactDetails = [
      { icon: <MapPin/>, title: "Our Address", value: "123 Minhaaj Street, Islamic City, 12345" },
      { icon: <Phone/>, title: "Call Us", value: "+1 (234) 567-8900" },
      { icon: <Mail/>, title: "Email Us", value: "contact@minhaajulhudaa-masjid.org" },
  ];

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are here to help. Reach out to us with any questions or inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <ModernCard variant="glass" className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                    <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" name="subject" required />
                    </div>
                    <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" rows={6} required />
                    </div>
                    <ModernButton type="submit" className="w-full" size="lg">Send Message</ModernButton>
                </form>
            </ModernCard>

            {/* Contact Details */}
            <div className="space-y-8">
                {contactDetails.map(detail => (
                    <ModernCard key={detail.title} className="p-6 flex items-center">
                        <div className="text-primary mr-6">{React.cloneElement(detail.icon, { className: "w-8 h-8" })}</div>
                        <div>
                            <h3 className="text-xl font-semibold">{detail.title}</h3>
                            <p className="text-muted-foreground">{detail.value}</p>
                        </div>
                    </ModernCard>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MasjidContact;