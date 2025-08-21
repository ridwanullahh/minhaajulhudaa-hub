import React, { useState, useEffect } from 'react';
import { masjidDB } from '@/lib/platform-db';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import RichMediaPlayer from '@/components/ui/RichMediaPlayer';

interface AudioTrack {
  id: string;
  title: string;
  speaker: string;
  category: string;
  url: string;
  duration: string;
}

const MasjidAudioLibrary = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTrack, setActiveTrack] = useState<AudioTrack | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      try {
        const data = await masjidDB.get('audio_library');
        setTracks(data);
        setFilteredTracks(data);
      } catch (error) {
        console.error("Error loading audio library:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTracks();
  }, []);

  useEffect(() => {
    const results = tracks.filter(track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTracks(results);
  }, [searchTerm, tracks]);

  if (isLoading) {
    return <div className="text-center py-20">Loading Audio Library...</div>;
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Islamic <span className="text-primary">Audio Library</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Listen to lectures, sermons, and recitations from our collection.
          </p>
        </div>

        {/* Player and Search Section */}
        <div className="sticky top-20 bg-muted/80 backdrop-blur-lg z-40 p-6 rounded-2xl mb-12 shadow-lg">
            {activeTrack ? (
                <RichMediaPlayer
                    key={activeTrack.id} // Force re-render on track change
                    src={activeTrack.url}
                    trackInfo={{ title: activeTrack.title, artist: activeTrack.speaker }}
                />
            ) : (
                <div className="text-center text-muted-foreground p-8">Select a track to start listening</div>
            )}
             <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Search by title, speaker, or category..."
                className="w-full pl-12 pr-4 py-3 text-lg rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTracks.map((track) => (
            <ModernCard
                key={track.id}
                variant="glass"
                className={`p-6 cursor-pointer group ${activeTrack?.id === track.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveTrack(track)}
            >
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary">{track.title}</h3>
              <p className="text-sm text-muted-foreground">{track.speaker}</p>
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasjidAudioLibrary;