import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Rewind, FastForward, Settings } from 'lucide-react';
import { ModernButton } from './ModernButton';
import { Slider } from './slider';

interface RichMediaPlayerProps {
  src: string;
  trackInfo: {
    title: string;
    artist: string;
  };
}

const RichMediaPlayer = ({ src, trackInfo }: RichMediaPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    // Set the src when the component mounts or src changes
    audio.src = src;

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [src]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
      if(audioRef.current) {
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
      }
  };

  const handleVolumeChange = (value: number[]) => {
      if(audioRef.current) {
        audioRef.current.volume = value[0];
        setVolume(value[0]);
      }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-4 bg-background rounded-lg shadow-lg border">
      <audio ref={audioRef} />
      <div className="flex items-center justify-between mb-2">
        <div>
            <p className="font-bold">{trackInfo.title}</p>
            <p className="text-sm text-muted-foreground">{trackInfo.artist}</p>
        </div>
        <div className="flex items-center space-x-2">
            <ModernButton variant="ghost" size="icon"><Rewind/></ModernButton>
            <ModernButton size="lg" onClick={togglePlayPause}>{isPlaying ? <Pause/> : <Play/>}</ModernButton>
            <ModernButton variant="ghost" size="icon"><FastForward/></ModernButton>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span>{formatTime(currentTime)}</span>
        <Slider value={[currentTime]} max={duration || 100} onValueChange={handleSeek} />
        <span>{formatTime(duration)}</span>
      </div>
      <div className="flex items-center justify-end gap-4 mt-2">
        <div className="flex items-center gap-2 w-32">
            {volume > 0 ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
            <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange}/>
        </div>
      </div>
    </div>
  );
};

export default RichMediaPlayer;
