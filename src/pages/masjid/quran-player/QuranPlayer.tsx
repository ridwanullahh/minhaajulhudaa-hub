import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat } from 'lucide-react';
import archiveOrgService from '@/lib/archive-org/archive-service';

export const QuranPlayer: React.FC = () => {
  const [reciter, setReciter] = useState(archiveOrgService.getDefaultReciter());
  const [currentSurah, setCurrentSurah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const audioRef = useRef<HTMLAudioElement>(null);

  const chapters = archiveOrgService.getQuranChapters();
  const reciters = archiveOrgService.getQuranReciters();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentSurah < 114) {
      setCurrentSurah(currentSurah + 1);
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const handlePrevious = () => {
    if (currentSurah > 1) {
      setCurrentSurah(currentSurah - 1);
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      audioRef.current?.play();
    } else if (repeatMode === 'all' && currentSurah < 114) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  };

  const currentChapter = chapters.find(ch => ch.number === currentSurah);
  const audioUrl = archiveOrgService.getQuranAudioUrl(reciter.identifier, currentSurah);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Quran Player</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{currentChapter?.englishName}</h2>
                <p className="text-4xl font-arabic">{currentChapter?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentChapter?.type} • {currentChapter?.ayahs} Ayahs
                </p>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentSurah === 1}>
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button size="icon" className="w-16 h-16" onClick={handlePlayPause}>
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
                
                <Button variant="outline" size="icon" onClick={handleNext} disabled={currentSurah === 114}>
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Volume2 className="w-5 h-5" />
                <Slider
                  value={[volume]}
                  onValueChange={(v) => setVolume(v[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
                    const currentIndex = modes.indexOf(repeatMode);
                    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
                  }}
                >
                  <Repeat className="w-4 h-4 mr-2" />
                  {repeatMode === 'none' && 'No Repeat'}
                  {repeatMode === 'one' && 'Repeat One'}
                  {repeatMode === 'all' && 'Repeat All'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reciter</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={reciter.identifier}
                onValueChange={(value) => {
                  const newReciter = reciters.find(r => r.identifier === value);
                  if (newReciter) setReciter(newReciter);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reciters.map(r => (
                    <SelectItem key={r.identifier} value={r.identifier}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Surah List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {chapters.map(chapter => (
                  <Button
                    key={chapter.number}
                    variant={currentSurah === chapter.number ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setCurrentSurah(chapter.number);
                      if (isPlaying && audioRef.current) {
                        audioRef.current.play();
                      }
                    }}
                  >
                    <span className="font-mono mr-2">{chapter.number}</span>
                    {chapter.englishName}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuranPlayer;
