import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Search, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { authenticatedFetch } from '@/lib/api';

const EventGuestList = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchGuests();
    }
  }, [eventId]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`/events/guestbook/?event=${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch guests');
      }

      const data = await response.json();

      // Assuming the API returns a list of guests directly or inside a results property
      // Adjusting based on common DRF patterns, but safely handling array direct return too
      const guestData = Array.isArray(data.data) ? data : (data.data || []);
      
      // Map API response to component state structure if necessary
      // Assuming API returns fields like: id, guest_name, email, phone_number, check_in_time
      const formattedGuests = guestData.data.map(guest => ({
        id: guest.id,
        name: guest.name || 'Unknown',
        email: guest.email || '',
        phone: guest.phone || '',
        checkInTime: guest.created_at || guest.checkInTime || null
      }));

      setGuests(formattedGuests);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadGuests'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Check-in Time'];
    const csvData = guests.map((guest) => [
      guest.name,
      guest.email,
      guest.phone,
      guest.checkInTime || 'Not checked in',
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-${eventId}-guests.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: t('success'),
      description: t('csvDownloaded'),
    });
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('guestList')} - Event Guestbook Platform</title>
        <meta name="description" content="Event guest list management" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/events/${eventId}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadCSV}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {t('downloadCSV')}
            </Button>
            <Button
              onClick={() => toast({
                description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
              })}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {t('addGuest')}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t('guestList')}</CardTitle>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchGuests')}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {t('name')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {t('checkInTime')}
                    </th>
                    {/* Add more headers if needed */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {searchQuery ? t('noGuestsFound') : t('noGuestsYet')}
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest, index) => (
                      <motion.tr
                        key={guest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 ease-in-out"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                          {guest.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {guest.checkInTime ? new Date(guest.checkInTime).toLocaleString() : <span className="text-gray-400 dark:text-gray-500 italic">{t('notCheckedIn')}</span>}
                        </td>
                        {/* Add more cells if needed */}
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EventGuestList;