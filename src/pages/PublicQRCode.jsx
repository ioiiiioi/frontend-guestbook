import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { QrCode, Download, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const PublicQRCode = () => {
  const { eventId } = useParams();
  const { t } = useLanguage();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      // Using relative path to allow proxy configuration to handle the domain
      const response = await fetch(`https://backend.ricefield-dev.cloud/api/v1/events/qr/${eventId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("QR API Response:", data); // Debug log

      // Robust data extraction to handle various API response structures
      // Priority: data.event -> data.data -> data (root)
      const eventData = data.event || data.data || data;

      if (!eventData) {
        throw new Error("Invalid API response structure");
      }

      // Extract and normalize QR Code
      // Check eventData.qr_code, eventData.qr_image, or fallback to root data.qr_code
      let rawQrCode = eventData.qr_code || eventData.qr_image || data.qr_code;
      let qrCodeUrl = '';

      if (rawQrCode) {
        // Remove any existing data:image... prefix if it's somehow double-encoded or different format, 
        // though usually we just check if it starts with it.
        // Safer approach: if it doesn't start with 'data:', assume it's raw base64 png
        if (rawQrCode.startsWith('data:')) {
            qrCodeUrl = rawQrCode;
        } else {
            // Default to PNG if just base64 string is provided
            qrCodeUrl = `data:image/png;base64,${rawQrCode}`;
        }
      }

      setEvent({
        id: eventId,
        title: eventData.name || eventData.title || 'Event Name Unavailable',
        date: (eventData.start_date) 
          ? new Date(eventData.start_date).toLocaleDateString() 
          : '-',
        location: [
          eventData.venue_name,
          eventData.city
        ].filter(Boolean).join(', ') || '-',
        qrCodeUrl: qrCodeUrl,
      });
      
    } catch (error) {
      console.error("Error fetching QR code:", error);
      toast({
        title: t('error'),
        description: t('failedToLoadEvent'),
        variant: 'destructive',
      });
      // Set empty event state so UI shows something (error state) rather than infinite loading
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!event?.qrCodeUrl) {
        toast({
            title: t('error'),
            description: "No QR code available to download",
            variant: "destructive"
        });
        return;
    }

    try {
        const link = document.createElement('a');
        link.href = event.qrCodeUrl;
        // Clean filename
        const safeTitle = (event.title || 'event').toLowerCase().replace(/[^a-z0-9]/g, '-');
        link.download = `${safeTitle}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: t('success'),
            description: t('qrCodeDownloaded'),
        });
    } catch (err) {
        console.error("Download failed:", err);
        toast({
            title: t('error'),
            description: "Failed to download QR code",
            variant: "destructive"
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="pt-6 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t('eventNotFound')}</h3>
            <p className="text-gray-500 mb-6">{t('failedToLoadEvent')}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
                Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event.title} - QR Code</title>
        <meta name="description" content={`QR Code for ${event.title}`} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-2xl border-t-4 border-t-green-600">
            <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 pb-8">
              <div className="mx-auto w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <QrCode className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold break-words px-4">
                {event.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="-mt-4 pt-0 space-y-6 bg-white dark:bg-gray-950 rounded-b-xl">
              <div className="flex flex-col items-center space-y-6 pt-6">
                <div className="p-4 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800">
                  {event.qrCodeUrl ? (
                    <img
                      src={event.qrCodeUrl}
                      alt={`${event.title} QR Code`}
                      className="w-64 h-64 object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400">
                      <QrCode className="w-12 h-12 mb-2 opacity-50" />
                      <span>No QR Code</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleDownloadQR}
                  disabled={!event.qrCodeUrl}
                  className="bg-green-600 hover:bg-green-700 gap-2 w-full sm:w-auto shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  {t('downloadQRCode')}
                </Button>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('date')}</p>
                    <p className="font-semibold text-lg">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('location')}</p>
                    <p className="font-semibold text-lg">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 bg-gray-50 dark:bg-gray-900/50 -mx-6 -mb-6 p-4 rounded-b-xl border-t border-gray-100 dark:border-gray-800">
                <p>{t('scanQRToCheckIn')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default PublicQRCode;