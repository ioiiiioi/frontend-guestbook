import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Video, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const EventMedia = () => {
  const { t } = useLanguage();
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    // API placeholder
    try {
      // const response = await fetch('/api/media');
      const mockMedia = [
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', eventId: 1, eventName: 'Annual Gala 2024' },
        { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400', eventId: 1, eventName: 'Annual Gala 2024' },
        { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400', eventId: 2, eventName: 'Product Launch' },
        { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', eventId: 2, eventName: 'Product Launch' },
        { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400', eventId: 3, eventName: 'Team Building' },
        { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400', eventId: 3, eventName: 'Team Building' },
      ];
      
      setMedia(mockMedia);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToLoadMedia'),
        variant: 'destructive',
      });
    }
  };

  const handleUpload = () => {
    toast({
      description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  const handleDelete = async (mediaId) => {
    // API placeholder
    try {
      // await fetch(`/api/media/${mediaId}`, { method: 'DELETE' });
      
      setMedia(media.filter((item) => item.id !== mediaId));
      
      toast({
        title: t('success'),
        description: t('mediaDeleted'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToDeleteMedia'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('media')} - Event Guestbook Platform</title>
        <meta name="description" content="Event media gallery" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('media')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('manageEventMedia')}
            </p>
          </div>
          <Button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <Upload className="w-4 h-4" />
            {t('uploadMedia')}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {media.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                <div
                  className="relative aspect-square bg-gray-100 dark:bg-gray-800"
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.eventName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.eventName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.type === 'image' ? (
                      <ImageIcon className="w-3 h-3" />
                    ) : (
                      <Video className="w-3 h-3" />
                    )}
                    <span className="capitalize">{item.type}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {media.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('noMedia')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('uploadFirstMedia')}
            </p>
            <Button
              onClick={handleUpload}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('uploadMedia')}
            </Button>
          </div>
        )}

        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedMedia?.eventName}</DialogTitle>
            </DialogHeader>
            {selectedMedia?.type === 'image' && (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.eventName}
                className="w-full h-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default EventMedia;