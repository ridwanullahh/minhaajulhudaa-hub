import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Search, Folder, Image, Video, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import cloudinaryService, { MediaRecord } from '@/lib/cloudinary/cloudinary-service';

interface MediaManagerProps {
  platform: string;
  folder?: string;
  onSelect?: (media: MediaRecord) => void;
  multiple?: boolean;
  accept?: string;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  platform,
  folder,
  onSelect,
  multiple = false,
  accept,
}) => {
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!cloudinaryService.isConfigured()) {
      toast({
        title: 'Cloudinary Not Configured',
        description: 'Please configure Cloudinary in your environment variables',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const results = await cloudinaryService.uploadMultiple(
        acceptedFiles,
        { folder: folder || platform },
        setUploadProgress
      );

      const mediaRecords = await Promise.all(
        results.map(result => cloudinaryService.saveToDatabase(result, platform))
      );

      setMedia(prev => [...mediaRecords, ...prev]);

      toast({
        title: 'Upload Successful',
        description: `${acceptedFiles.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [platform, folder, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
  });

  const handleSelectMedia = (mediaItem: MediaRecord) => {
    if (multiple) {
      setSelectedMedia(prev => {
        const isSelected = prev.some(m => m.uid === mediaItem.uid);
        if (isSelected) {
          return prev.filter(m => m.uid !== mediaItem.uid);
        } else {
          return [...prev, mediaItem];
        }
      });
    } else {
      setSelectedMedia([mediaItem]);
      if (onSelect) {
        onSelect(mediaItem);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (onSelect && selectedMedia.length > 0) {
      onSelect(selectedMedia[0]);
    }
  };

  const getMediaIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileIcon className="w-4 h-4" />;
    }
  };

  const filteredMedia = media.filter(m =>
    m.publicId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {uploading ? (
          <div className="space-y-2">
            <p>Uploading... {Math.round(uploadProgress)}%</p>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground">
              {isDragActive
                ? 'Drop files here...'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {accept || 'All file types supported'}
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((mediaItem) => {
          const isSelected = selectedMedia.some(m => m.uid === mediaItem.uid);
          
          return (
            <div
              key={mediaItem.uid}
              className={`
                relative group border rounded-lg overflow-hidden cursor-pointer
                transition-all duration-200
                ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'}
              `}
              onClick={() => handleSelectMedia(mediaItem)}
            >
              {mediaItem.resourceType === 'image' ? (
                <img
                  src={cloudinaryService.getOptimizedUrl(mediaItem.publicId, {
                    width: 300,
                    height: 300,
                    crop: 'fill',
                    quality: 'auto',
                  })}
                  alt={mediaItem.publicId}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-muted">
                  {getMediaIcon(mediaItem.resourceType)}
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm px-2 text-center truncate">
                  {mediaItem.publicId.split('/').pop()}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedMedia.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedMedia([])}>
            Clear Selection
          </Button>
          <Button onClick={handleConfirmSelection}>
            Confirm ({selectedMedia.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaManager;
