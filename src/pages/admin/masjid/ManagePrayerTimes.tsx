import React, { useState, useEffect } from 'react';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ManagePrayerTimes = () => {
  const [times, setTimes] = useState({
    fajr: { adhan: '', iqamah: '' },
    dhuhr: { adhan: '', iqamah: '' },
    asr: { adhan: '', iqamah: '' },
    maghrib: { adhan: '', iqamah: '' },
    isha: { adhan: '', iqamah: '' },
    jumah: { adhan: '', iqamah: '' },
  });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [docId, setDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTimesForDate(date);
  }, [date]);

  const loadTimesForDate = async (d: string) => {
    setIsLoading(true);
    try {
      const data = await masjidDB.get('prayer_times');
      const found = data.find(p => p.date === d);
      if (found) {
        setTimes(found);
        setDocId(found.id);
      } else {
        // Reset form if no data for this date
        setTimes({ fajr: { adhan: '', iqamah: '' }, dhuhr: { adhan: '', iqamah: '' }, asr: { adhan: '', iqamah: '' }, maghrib: { adhan: '', iqamah: '' }, isha: { adhan: '', iqamah: '' }, jumah: { adhan: '', iqamah: '' } });
        setDocId(null);
      }
    } catch (error) {
      console.error("Error loading prayer times:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (prayer: string, type: 'adhan' | 'iqamah', value: string) => {
    setTimes(prev => ({
      ...prev,
      [prayer]: { ...prev[prayer], [type]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const dataToSave = { ...times, date };
    try {
      if (docId) {
        await masjidDB.update('prayer_times', docId, dataToSave);
      } else {
        await masjidDB.insert('prayer_times', dataToSave);
      }
      alert(`Prayer times for ${date} saved successfully.`);
      loadTimesForDate(date); // Refresh data
    } catch (error) {
      console.error("Error saving prayer times:", error);
      alert("Failed to save prayer times.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Prayer Times</h1>
      <ModernCard>
        <div className="p-6">
            <Label htmlFor="date-picker">Select Date</Label>
            <Input id="date-picker" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-6 max-w-sm"/>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.keys(times).map(prayer => (
                        <div key={prayer} className="p-4 border rounded-lg">
                            <h3 className="font-bold capitalize mb-2">{prayer}</h3>
                            <div className="space-y-2">
                                <div>
                                    <Label>Adhan</Label>
                                    <Input value={times[prayer]?.adhan || ''} onChange={(e) => handleChange(prayer, 'adhan', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Iqamah</Label>
                                    <Input value={times[prayer]?.iqamah || ''} onChange={(e) => handleChange(prayer, 'iqamah', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <ModernButton type="submit" className="mt-6" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Times for Selected Date'}
                </ModernButton>
            </form>
        </div>
      </ModernCard>
    </div>
  );
};

export default ManagePrayerTimes;
