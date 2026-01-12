import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, FileText, QrCode, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { authenticatedFetch } from '@/lib/api';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`events/${eventId}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      const formattedEvent = {
        id: data.data.id,
        title: data.data.name || 'Untitled Event',
        date: data.data.start_date ? data.data.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
        location: data.data.venue_name || data.data.address || 'Online',
        address: data.data.address || 'Online',
        msg_template: data.data.msg_template || '',
        feedback_template: data.data.feedback_template || '',
        guests: data.data.guests_count || 0,
      };
      
      setEvent(formattedEvent);
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast({
        title: t('error'),
        description: t('failedToLoadEventDetails'),
        variant: 'destructive',
      });
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportDetails = async () => {
    try {
      console.log(`[API Call] Requesting export for event ${eventId} to https://backend.ricefield-dev.cloud`);
      
      const response = await authenticatedFetch(`events/${eventId}/export/`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }
      
      toast({
        title: "Export Initiated",
        description: "Event details export has been successfully requested.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: t('error'),
        description: `Failed to export event details: ${error.message}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('eventNotFound')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The event you are looking for does not exist or an error occurred.
        </p>
        <Button onClick={() => navigate('/events')} className="mt-4">
          {t('backToEvents')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event.title} - Event Guestbook Platform</title>
        <meta name="description" content={event.description} />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/events')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardTitle className="text-3xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('date')}</p>
                      <p className="font-semibold">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('location')}</p>
                      <p className="font-semibold">{event.location}, {event.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('attendees')}</p>
                      <p className="font-semibold">
                        {event.guests}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <FileText className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('Message Template')}</p>
                      <p className="font-medium">{event.msg_template}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <FileText className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('Feedback Template')}</p>
                      <p className="font-medium">{event.feedback_template}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <Button
                  onClick={() => navigate(`/events/${event.id}/guests`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {t('guestList')}
                </Button>
                <Button
                  onClick={() => window.open(`/qr/${event.id}`, '_blank')}
                  variant="outline"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {t('viewQRCode')}
                </Button>
                <Button
                  onClick={handleExportDetails}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('exportDetails')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default EventDetail;