import React, { useState } from 'react';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, DollarSign } from 'lucide-react';

const MasjidDonations = () => {
  const [amount, setAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const donationAmounts = [25, 50, 100, 250, 500, 1000];
  const campaigns = [
      { id: 'general', name: 'General Masjid Fund' },
      { id: 'education', name: 'Islamic Education' },
      { id: 'maintenance', name: 'Building Maintenance' },
      { id: 'zakat', name: 'Zakat al-Mal' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid donation amount.");
        return;
    }
    setIsSubmitting(true);
    try {
      await masjidDB.insert('donations', {
        amount: Number(amount),
        campaign: selectedCampaign,
        donorEmail: 'anonymous@minhaajulhudaa.org', // Placeholder
        status: 'completed',
        createdAt: new Date().toISOString(),
      });
      alert('JazakAllah Khair! Your donation has been received.');
      setAmount('');
    } catch (error) {
      console.error("Donation failed:", error);
      alert("There was an error processing your donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Support <span className="text-primary">Our Masjid</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your generous contributions help us maintain our services and support the community.
          </p>
        </div>

        <ModernCard variant="glass" className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
                <div>
                    <Label className="text-lg font-semibold">Choose Donation Amount</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                        {donationAmounts.map(a => (
                            <ModernButton key={a} type="button" variant={amount === String(a) ? 'default' : 'outline'} onClick={() => setAmount(String(a))}>
                                ${a}
                            </ModernButton>
                        ))}
                    </div>
                    <div className="flex items-center mt-4">
                        <DollarSign className="mr-2 text-muted-foreground"/>
                        <Input
                            type="number"
                            placeholder="Or enter a custom amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-lg"
                        />
                    </div>
                </div>

                <div>
                    <Label className="text-lg font-semibold">Select a Campaign</Label>
                    <RadioGroup value={selectedCampaign} onValueChange={setSelectedCampaign} className="mt-4 space-y-2">
                        {campaigns.map(c => (
                             <Label key={c.id} className="flex items-center p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                                <RadioGroupItem value={c.id} id={c.id} />
                                <span className="ml-4 font-medium">{c.name}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>

                <ModernButton type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Donate Now'}
                    <Heart className="ml-2 w-5 h-5"/>
                </ModernButton>
            </div>
          </form>
        </ModernCard>
      </div>
    </div>
  );
};

export default MasjidDonations;