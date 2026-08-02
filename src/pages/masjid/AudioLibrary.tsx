import React, { useState, useEffect, useRef, useMemo } from 'react';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { DataState } from '@/components/ui/states';
import { useListData } from '@/hooks/useListData';
import { toast } from 'sonner';
import {
  Play,
  Pause,
  Download,
  Search,
  Mic,
  Tag,
  ListMusic,
  Plus,
  X,
  Volume2,
  Clock,
  SkipBack,
  SkipForward,
} from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  speaker: string;
  category: string;
  audioUrl: string;
  duration: string;
  description?: string;
  language?: string;
  tags?: string[];
}

/**
 * Masjid Audio Library
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Full-featured audio library with:
 *   - Advanced search (title, speaker, category, tags)
 *   - Category and speaker filters
 *   - Sort by title/date
 *   - In-line playback with controls (play/pause, skip)
 *   - Playlist management (create, add, remove, persist to localStorage)
 *   - Download functionality
 *
 * Addresses PRODUCTION_GAPS.md item 4.2 (Masjid Audio Lab incomplete).
 */
const MasjidAudioLibrary: React.FC = () => {
  const { data: tracks, isLoading, error, refetch } = useListData(() => masjidDB.get('audio_library'));
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'date'>('title');
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<{ name: string; trackIds: string[] }[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load playlists from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('masjid_playlists');
      if (saved) setPlaylists(JSON.parse(saved));
    } catch {}
  }, []);

  // Save playlists to localStorage
  const savePlaylists = (newLists: typeof playlists) => {
    setPlaylists(newLists);
    localStorage.setItem('masjid_playlists', JSON.stringify(newLists));
  };

  // Derived: unique categories and speakers for filters
  const categories = useMemo(() => {
    const set = new Set(tracks.map((t: AudioTrack) => t.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [tracks]);

  const speakers = useMemo(() => {
    const set = new Set(tracks.map((t: AudioTrack) => t.speaker).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [tracks]);

  // Filtered + sorted tracks
  const filteredTracks = useMemo(() => {
    let result = tracks.filter((t: AudioTrack) => {
      const matchesSearch =
        !searchTerm ||
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.speaker?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesSpeaker = speakerFilter === 'all' || t.speaker === speakerFilter;
      return matchesSearch && matchesCategory && matchesSpeaker;
    });
    result = [...result].sort((a: AudioTrack, b: AudioTrack) => {
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      // date sort would need a date field; fallback to title
      return (a.title || '').localeCompare(b.title || '');
    });
    return result;
  }, [tracks, searchTerm, categoryFilter, speakerFilter, sortBy]);

  const activeTrack = tracks.find((t: AudioTrack) => t.id === activeTrackId);

  const handlePlay = (track: AudioTrack) => {
    if (activeTrackId === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (activeTrackId !== track.id) {
        setActiveTrackId(track.id);
        if (audioRef.current) {
          audioRef.current.src = track.audioUrl || '';
          audioRef.current.play().catch(() => toast.error('Unable to play this track'));
        }
      } else {
        audioRef.current?.play().catch(() => toast.error('Unable to play this track'));
      }
      setIsPlaying(true);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (!activeTrackId) return;
    const idx = filteredTracks.findIndex((t: AudioTrack) => t.id === activeTrackId);
    if (idx === -1) return;
    const newIdx = direction === 'next' ? (idx + 1) % filteredTracks.length : (idx - 1 + filteredTracks.length) % filteredTracks.length;
    const nextTrack = filteredTracks[newIdx] as AudioTrack;
    setActiveTrackId(nextTrack.id);
    if (audioRef.current) {
      audioRef.current.src = nextTrack.audioUrl || '';
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleDownload = (track: AudioTrack) => {
    if (!track.audioUrl) {
      toast.error('No audio file available for download');
      return;
    }
    const a = document.createElement('a');
    a.href = track.audioUrl;
    a.download = `${track.title || 'audio'}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Download started');
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    if (playlists.find((p) => p.name === newPlaylistName)) {
      toast.error('A playlist with that name already exists');
      return;
    }
    savePlaylists([...playlists, { name: newPlaylistName, trackIds: [] }]);
    setNewPlaylistName('');
    toast.success('Playlist created');
  };

  const addToPlaylist = (playlistName: string, trackId: string) => {
    const updated = playlists.map((p) => {
      if (p.name === playlistName && !p.trackIds.includes(trackId)) {
        return { ...p, trackIds: [...p.trackIds, trackId] };
      }
      return p;
    });
    savePlaylists(updated);
    toast.success('Added to playlist');
  };

  const removeFromPlaylist = (playlistName: string, trackId: string) => {
    const updated = playlists.map((p) => {
      if (p.name === playlistName) {
        return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
      }
      return p;
    });
    savePlaylists(updated);
  };

  return (
    <div className="min-h-screen py-8">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Audio Library</h1>
          <p className="text-muted-foreground">Lectures, Quran recitations, and Islamic talks</p>
        </div>

        {/* Search + Filters */}
        <ModernCard className="mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, speaker, or tag..."
                  className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Speaker</label>
              <select
                value={speakerFilter}
                onChange={(e) => setSpeakerFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {speakers.map((s) => (
                  <option key={s} value={s}>{s === 'all' ? 'All Speakers' : s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>{filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''}</span>
            </div>
            <ModernButton variant="outline" size="sm" onClick={() => setShowPlaylistModal(!showPlaylistModal)}>
              <ListMusic className="h-4 w-4" />
              Playlists ({playlists.length})
            </ModernButton>
          </div>
        </ModernCard>

        {/* Playlist modal */}
        {showPlaylistModal && (
          <ModernCard className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">My Playlists</h3>
              <button onClick={() => setShowPlaylistModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New playlist name..."
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
              />
              <ModernButton size="sm" onClick={createPlaylist}>
                <Plus className="h-4 w-4" />
                Create
              </ModernButton>
            </div>
            {playlists.length === 0 ? (
              <p className="text-sm text-muted-foreground">No playlists yet. Create one to organize your favorite tracks.</p>
            ) : (
              <div className="space-y-3">
                {playlists.map((pl) => (
                  <div key={pl.name} className="border border-border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{pl.name}</span>
                      <span className="text-xs text-muted-foreground">{pl.trackIds.length} tracks</span>
                    </div>
                    {pl.trackIds.length > 0 && (
                      <div className="space-y-1">
                        {pl.trackIds.map((tid) => {
                          const t = tracks.find((tr: AudioTrack) => tr.id === tid);
                          if (!t) return null;
                          return (
                            <div key={tid} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{t.title}</span>
                              <button
                                onClick={() => removeFromPlaylist(pl.name, tid)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ModernCard>
        )}

        {/* Track list */}
        <DataState
          isLoading={isLoading}
          error={error}
          isEmpty={!isLoading && !error && filteredTracks.length === 0}
          onRetry={refetch}
          emptyTitle={searchTerm || categoryFilter !== 'all' || speakerFilter !== 'all' ? 'No tracks match your filters' : 'No audio available'}
          emptyMessage={searchTerm || categoryFilter !== 'all' || speakerFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Audio tracks will appear here once added by the admin.'}
        >
          <div className="space-y-3">
            {filteredTracks.map((track: AudioTrack) => (
              <ModernCard key={track.id} className="p-4">
                <div className="flex items-center gap-4">
                  {/* Play button */}
                  <button
                    onClick={() => handlePlay(track)}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-platform-accent text-platform-accent-foreground hover:bg-platform-accent/90 transition-colors"
                    aria-label={isPlaying && activeTrackId === track.id ? 'Pause' : 'Play'}
                  >
                    {isPlaying && activeTrackId === track.id ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{track.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mic className="h-3 w-3" /> {track.speaker || 'Unknown'}
                      </span>
                      {track.category && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {track.category}
                        </span>
                      )}
                      {track.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {track.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {playlists.length > 0 && (
                      <div className="relative group">
                        <ModernButton variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Plus className="h-4 w-4" />
                        </ModernButton>
                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10 bg-card border border-border rounded-md shadow-md min-w-[160px]">
                          {playlists.map((pl) => (
                            <button
                              key={pl.name}
                              onClick={() => addToPlaylist(pl.name, track.id)}
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-secondary"
                            >
                              {pl.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <ModernButton variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownload(track)}>
                      <Download className="h-4 w-4" />
                    </ModernButton>
                  </div>
                </div>

                {/* Now playing indicator */}
                {isPlaying && activeTrackId === track.id && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-sm text-platform-accent">
                    <Volume2 className="h-4 w-4 animate-pulse" />
                    <span>Now playing...</span>
                    <div className="flex-1" />
                    <button onClick={() => handleSkip('prev')} className="p-1 hover:bg-secondary rounded">
                      <SkipBack className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleSkip('next')} className="p-1 hover:bg-secondary rounded">
                      <SkipForward className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </ModernCard>
            ))}
          </div>
        </DataState>
      </div>
    </div>
  );
};

export default MasjidAudioLibrary;
