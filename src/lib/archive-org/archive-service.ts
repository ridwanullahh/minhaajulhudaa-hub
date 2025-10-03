import config from '../config';

export interface QuranReciter {
  identifier: string;
  name: string;
  language: string;
  bitrate: string;
}

export interface AudioItem {
  identifier: string;
  title: string;
  description: string;
  creator: string;
  date: string;
  downloads: number;
  format: string;
  files: AudioFile[];
}

export interface AudioFile {
  name: string;
  format: string;
  size: string;
  url: string;
  length?: string;
}

export interface QuranChapter {
  number: number;
  name: string;
  englishName: string;
  ayahs: number;
  type: 'Meccan' | 'Medinan';
}

class ArchiveOrgService {
  private baseUrl = 'https://archive.org';
  private apiKey: string;

  private quranChapters: QuranChapter[] = [
    { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', ayahs: 7, type: 'Meccan' },
    { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', ayahs: 286, type: 'Medinan' },
    { number: 3, name: 'آل عمران', englishName: 'Ali Imran', ayahs: 200, type: 'Medinan' },
    { number: 4, name: 'النساء', englishName: 'An-Nisa', ayahs: 176, type: 'Medinan' },
    { number: 5, name: 'المائدة', englishName: 'Al-Maidah', ayahs: 120, type: 'Medinan' },
  ];

  private popularReciters: QuranReciter[] = [
    { identifier: 'AbdulBaset_AbdulSamad_Mujawwad_128kbps', name: 'Abdul Basit Abdul Samad', language: 'Arabic', bitrate: '128kbps' },
    { identifier: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Hussary', language: 'Arabic', bitrate: '128kbps' },
    { identifier: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy', language: 'Arabic', bitrate: '128kbps' },
    { identifier: 'Mohammad_al_Tablaway_128kbps', name: 'Mohammad al-Tablaway', language: 'Arabic', bitrate: '128kbps' },
    { identifier: 'Ghamadi_40kbps', name: 'Saad Al-Ghamadi', language: 'Arabic', bitrate: '40kbps' },
  ];

  constructor() {
    this.apiKey = config.archiveOrg.apiKey;
  }

  async searchAudio(query: string, page: number = 1): Promise<AudioItem[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,description,creator,date,downloads&mediatype=audio&output=json&page=${page}`
      );

      if (!response.ok) {
        throw new Error('Failed to search Archive.org');
      }

      const data = await response.json();
      return data.response.docs.map((doc: any) => ({
        identifier: doc.identifier,
        title: doc.title,
        description: doc.description || '',
        creator: doc.creator || 'Unknown',
        date: doc.date || '',
        downloads: doc.downloads || 0,
        format: 'audio',
        files: [],
      }));
    } catch (error) {
      console.error('Archive.org search error:', error);
      return [];
    }
  }

  async getItemDetails(identifier: string): Promise<AudioItem | null> {
    try {
      const response = await fetch(`${this.baseUrl}/metadata/${identifier}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }

      const data = await response.json();
      const metadata = data.metadata;
      const files = data.files || [];

      const audioFiles = files
        .filter((file: any) => file.format === 'VBR MP3' || file.format === 'MP3')
        .map((file: any) => ({
          name: file.name,
          format: file.format,
          size: file.size,
          url: `${this.baseUrl}/download/${identifier}/${file.name}`,
          length: file.length,
        }));

      return {
        identifier,
        title: metadata.title || identifier,
        description: metadata.description || '',
        creator: metadata.creator || 'Unknown',
        date: metadata.date || '',
        downloads: 0,
        format: 'audio',
        files: audioFiles,
      };
    } catch (error) {
      console.error('Failed to fetch item details:', error);
      return null;
    }
  }

  getQuranAudioUrl(reciterIdentifier: string, surahNumber: number): string {
    const paddedNumber = surahNumber.toString().padStart(3, '0');
    return `${this.baseUrl}/download/${reciterIdentifier}/${paddedNumber}.mp3`;
  }

  getQuranReciters(): QuranReciter[] {
    return this.popularReciters;
  }

  getDefaultReciter(): QuranReciter {
    return this.popularReciters[0];
  }

  getQuranChapters(): QuranChapter[] {
    return this.quranChapters;
  }

  getChapterByNumber(number: number): QuranChapter | undefined {
    return this.quranChapters.find(ch => ch.number === number);
  }

  async searchIslamicLectures(speaker?: string, topic?: string, page: number = 1): Promise<AudioItem[]> {
    let query = 'islamic lecture';
    
    if (speaker) {
      query += ` ${speaker}`;
    }
    
    if (topic) {
      query += ` ${topic}`;
    }

    return this.searchAudio(query, page);
  }

  async getPopularLectures(): Promise<AudioItem[]> {
    return this.searchAudio('islamic lecture', 1);
  }

  buildPlaylist(items: AudioFile[]): AudioFile[] {
    return items.map(item => ({
      ...item,
      url: item.url,
    }));
  }

  async getQuranPlaylistForReciter(reciterIdentifier: string): Promise<AudioFile[]> {
    const playlist: AudioFile[] = [];
    
    for (let i = 1; i <= 114; i++) {
      const chapter = this.getChapterByNumber(i);
      playlist.push({
        name: `${i.toString().padStart(3, '0')}.mp3`,
        format: 'MP3',
        size: 'Unknown',
        url: this.getQuranAudioUrl(reciterIdentifier, i),
        length: chapter ? `Surah ${chapter.englishName}` : `Surah ${i}`,
      });
    }
    
    return playlist;
  }
}

export const archiveOrgService = new ArchiveOrgService();
export default archiveOrgService;
