import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import {
  Play,
  Pause,
  Download,
  Share2,
  Search,
  Mic,
  Tag,
} from 'lucide-react';

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
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const togglePlay = (track: AudioTrack) => {
    if (audioRef.current) {
      if (activeTrackId === track.id && !audioRef.current.paused) {
        audioRef.current.pause();
        setActiveTrackId(null);
      } else {
        audioRef.current.src = track.url;
        audioRef.current.play();
        setActiveTrackId(track.id);
      }
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-20">Loading Audio Library...</div>;
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <audio ref={audioRef} onEnded={() => setActiveTrackId(null)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Islamic <span className="text-primary">Audio Library</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Listen to lectures, sermons, and recitations from our collection.
          </p>
        </div>

        <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTracks.map((track) => (
            <ModernCard key={track.id} variant="glass" className="p-6 flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-2">{track.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Mic className="w-4 h-4 mr-2" /> {track.speaker}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <Tag className="w-4 h-4 mr-2" /> {track.category}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <ModernButton onClick={() => togglePlay(track)} leftIcon={activeTrackId === track.id ? <Pause size={16} /> : <Play size={16} />}>
                  {activeTrackId === track.id ? 'Pause' : 'Play'}
                </ModernButton>
                <div className="flex items-center space-x-2">
                    <a href={track.url} download target="_blank" rel="noopener noreferrer">
                        <ModernButton variant="outline" size="icon"><Download size={16} /></ModernButton>
                    </a>
                    <ModernButton variant="outline" size="icon"><Share2 size={16} /></ModernButton>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasjidAudioLibrary;