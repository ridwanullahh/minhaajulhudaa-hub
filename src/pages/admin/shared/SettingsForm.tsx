import React, { useState, useEffect } from 'react';
import { getPlatformDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle } from 'lucide-react';

interface SettingsFormProps {
  platform: string;
}

const SettingsForm = ({ platform }: SettingsFormProps) => {
  const [settings, setSettings] = useState({
    phone: '',
    email: '',
    address: '',
    socials: [{ name: '', url: '' }]
  });
  const [docId, setDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const db = getPlatformDB(platform);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settingsData = await db.get('settings');
        if (settingsData.length > 0) {
          setSettings(settingsData[0]);
          setDocId(settingsData[0].id);
        } else {
          // If no settings exist, create a default entry
          const newSettings = await db.insert('settings', { platform, ...settings });
          setDocId(newSettings.id);
        }
      } catch (error) {
        console.error(`Error loading settings for ${platform}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [platform]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (index: number, field: 'name' | 'url', value: string) => {
    const updatedSocials = [...settings.socials];
    updatedSocials[index][field] = value;
    setSettings(prev => ({ ...prev, socials: updatedSocials }));
  };

  const addSocialField = () => {
    setSettings(prev => ({ ...prev, socials: [...prev.socials, { name: '', url: '' }] }));
  };

  const removeSocialField = (index: number) => {
    const updatedSocials = settings.socials.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, socials: updatedSocials }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (docId) {
        await db.update('settings', docId, settings);
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading settings...</div>

  return (
    <div>
        <h1 className="text-2xl font-bold mb-6 capitalize">{platform} Platform Settings</h1>
        <form onSubmit={handleSubmit}>
            <ModernCard className="mb-8">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <div className="space-y-4">
                        <div><Label>Phone Number</Label><Input name="phone" value={settings.phone} onChange={handleChange} /></div>
                        <div><Label>Email Address</Label><Input name="email" type="email" value={settings.email} onChange={handleChange} /></div>
                        <div><Label>Physical Address</Label><Textarea name="address" value={settings.address} onChange={handleChange} /></div>
                    </div>
                </div>
            </ModernCard>
            <ModernCard>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
                    <div className="space-y-4">
                        {settings.socials.map((social, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Input placeholder="Name (e.g., Facebook)" value={social.name} onChange={(e) => handleSocialChange(index, 'name', e.target.value)} />
                                <Input placeholder="Full URL" value={social.url} onChange={(e) => handleSocialChange(index, 'url', e.target.value)} />
                                <ModernButton variant="ghost" size="icon" onClick={() => removeSocialField(index)}><Trash2 className="w-4 h-4 text-red-500"/></ModernButton>
                            </div>
                        ))}
                    </div>
                    <ModernButton variant="outline" size="sm" className="mt-4" onClick={addSocialField} leftIcon={<PlusCircle className="w-4 h-4"/>}>Add Social Link</ModernButton>
                </div>
            </ModernCard>
            <ModernButton type="submit" className="mt-8" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save All Settings'}
            </ModernButton>
        </form>
    </div>
  );
};

export default SettingsForm;
