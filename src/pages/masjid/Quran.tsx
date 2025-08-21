import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

const QuranReader = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        setSurahs(data.data);
      } catch (error) {
        console.error("Error fetching surahs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const handleSelectSurah = async (surahNumber: number) => {
    setIsLoading(true);
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await response.json();
        setSelectedSurah(data.data);
        setAyahs(data.data.ayahs);
    } catch (error) {
        console.error("Error fetching surah details:", error);
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading && surahs.length === 0) {
      return <div className="text-center py-20">Loading Quran Index...</div>
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            The Holy <span className="text-primary">Qur'an</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Surah List */}
            <div className="lg:col-span-1">
                <ModernCard className="p-4 max-h-[70vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Surahs</h2>
                    <div className="space-y-2">
                        {surahs.map(s => (
                            <button key={s.number} onClick={() => handleSelectSurah(s.number)} className={`w-full text-left p-3 rounded-lg text-sm ${selectedSurah?.number === s.number ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>
                                {s.number}. {s.englishName} ({s.name})
                            </button>
                        ))}
                    </div>
                </ModernCard>
            </div>

            {/* Ayah View */}
            <div className="lg:col-span-3">
                <ModernCard className="p-8">
                    {isLoading ? <p>Loading Surah...</p> : selectedSurah ? (
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{selectedSurah.englishName}</h2>
                            <h3 className="text-xl text-muted-foreground mb-6">{selectedSurah.name}</h3>
                            <div className="space-y-6">
                                {ayahs.map(ayah => (
                                    <div key={ayah.number} className="border-b pb-4">
                                        <p className="text-2xl text-right font-arabic leading-relaxed">{ayah.text}</p>
                                        <span className="text-primary font-bold">{selectedSurah.number}:{ayah.numberInSurah}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Select a Surah from the list to begin reading.</p>
                    )}
                </ModernCard>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuranReader;
