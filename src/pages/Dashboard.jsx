import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { authenticatedFetch } from '@/lib/api';

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [events, setEvents] = useState({
    past: [],
    present: [],
    future: [],
  });
  const [counts, setCounts] = useState({
    past: 0,
    present: 0,
    future: 0,
  });
  const [loading, setLoading] = useState({
    past: false,
    present: false,
    future: false,
  });
  const [currentPage, setCurrentPage] = useState({
    past: 1,
    present: 1,
    future: 1,
  });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategoryEvents('past', 1);
    fetchCategoryEvents('present', 1);
    fetchCategoryEvents('future', 1);
  }, []);

  const fetchCategoryEvents = async (category, page) => {
    setLoading(prev => ({ ...prev, [category]: true }));
    try {
      const apiCategory = category === 'future' ? 'upcoming' : category;
      const res = await authenticatedFetch(`/events/slim/?category=${apiCategory}&page_size=${itemsPerPage}&page=${page}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch ${category} events`);
      }

      const data = await res.json();
      
      let results = [];
      let totalCount = 0;

      if (data.results && Array.isArray(data.results)) {
        results = data.results;
        totalCount = data.count || 0;
      } else if (data.data && data.data.results && Array.isArray(data.data.results)) {
         results = data.data.results;
         totalCount = data.data.count || 0;
      } else if (Array.isArray(data.data)) {
        results = data.data;
        totalCount = data.count || results.length;
      } else if (Array.isArray(data)) {
        results = data;
        totalCount = results.length;
      }

      const formattedEvents = results.map(e => ({
        id: e.id,
        title: e.name || 'Unnamed Event',
        date: e.start_date ? e.start_date.split('T')[0] : (e.date || new Date().toISOString().split('T')[0]),
        guests: e.guest_count || 0
      }));

      setEvents(prev => ({ ...prev, [category]: formattedEvents }));
      setCounts(prev => ({ ...prev, [category]: totalCount }));

    } catch (error) {
      console.error(`Error fetching ${category} events:`, error);
      toast({
        title: t('error'),
        description: `Failed to load ${category} events`,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const handlePageChange = (category, newPage) => {
    setCurrentPage(prev => ({ ...prev, [category]: newPage }));
    fetchCategoryEvents(category, newPage);
  };

  // const onDragStart = (e, eventId, source) => {
  //   e.dataTransfer.setData('eventId', eventId);
  //   e.dataTransfer.setData('source', source);
  //   e.dataTransfer.effectAllowed = 'move';
  // };

  // const onDragOver = (e) => {
  //   e.preventDefault();
  //   e.dataTransfer.dropEffect = 'move';
  // };

  // const onDrop = async (e, target) => {
  //   e.preventDefault();
  //   const eventId = e.dataTransfer.getData('eventId');
  //   const source = e.dataTransfer.getData('source');

  //   if (source === target) return;

  //   const eventToMove = events[source].find((e) => String(e.id) === String(eventId));
  //   if (!eventToMove) return;

  //   // Calculate new date based on target column to ensure consistency
  //   const today = new Date();
  //   let newDateStr = eventToMove.date;

  //   if (target === 'present') {
  //       newDateStr = today.toISOString().split('T')[0];
  //   } else if (target === 'future') {
  //       const tomorrow = new Date(today);
  //       tomorrow.setDate(today.getDate() + 1);
  //       newDateStr = tomorrow.toISOString().split('T')[0];
  //   } else if (target === 'past') {
  //       const yesterday = new Date(today);
  //       yesterday.setDate(today.getDate() - 1);
  //       newDateStr = yesterday.toISOString().split('T')[0];
  //   }

  //   const updatedEvent = { ...eventToMove, date: newDateStr };
  //   const originalEvents = { ...events };
  //   const originalCounts = { ...counts };

  //   // Optimistic UI update
  //   setEvents(prev => ({
  //     ...prev,
  //     [source]: prev[source].filter((e) => String(e.id) !== String(eventId)),
  //     [target]: [...prev[target], updatedEvent],
  //   }));
    
  //   setCounts(prev => ({
  //       ...prev,
  //       [source]: Math.max(0, prev[source] - 1),
  //       [target]: prev[target] + 1
  //   }));

  //   try {
  //      // Perform API update to persist the change
  //      const res = await authenticatedFetch(`/events/${eventId}/`, { 
  //          method: 'PATCH', 
  //          headers: { 'Content-Type': 'application/json' },
  //          body: JSON.stringify({ start_date: newDateStr }) 
  //      });
       
  //      if (!res.ok) {
  //          throw new Error('Failed to persist move');
  //      }

  //      toast({
  //       title: t('success'),
  //       description: t('eventMoved'), 
  //     });
  //   } catch (error) {
  //     console.error('Drop error:', error);
  //     // Revert state on error
  //     setEvents(originalEvents);
  //     setCounts(originalCounts);
  //     toast({
  //       title: t('error'),
  //       description: t('failedToMoveEvent'),
  //       variant: 'destructive',
  //     });
  //   }
  // };

  const totalPages = (category) => {
    return Math.ceil(counts[category] / itemsPerPage);
  };

  const EventColumn = ({ title, category, icon: Icon, color }) => (
    <div
      // onDragOver={onDragOver}
      // onDrop={(e) => onDrop(e, category)}
      className="flex-1 min-w-[300px] flex flex-col"
    >
      <Card className={`h-full border-t-4 ${color} flex flex-col`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              ({counts[category]})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 flex-1">
          {loading[category] && events[category].length === 0 ? (
             <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
             </div>
          ) : (
            <>
              {loading[category] && events[category].length > 0 && (
                   <div className="flex justify-center py-2">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
                   </div>
              )}
              
              {events[category].map((event) => (
                <motion.div
                  key={event.id}
                  // draggable
                  // onDragStart={(e) => onDragStart(e, event.id, category)}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="group relative p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md cursor-pointer border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
                >
                  {/* <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div> */}

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 pr-4">
                    {event.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.guests}
                    </span>
                  </div>
                </motion.div>
              ))}

              {!loading[category] && events[category].length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  <p>{t('noEvents')}</p>
                  {/* <p className="text-xs mt-1 text-gray-300">{t('dragHere') || 'Drop events here'}</p> */}
                </div>
              )}

              {totalPages(category) > 1 && (
                <div className="flex justify-center gap-2 mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage[category] === 1 || loading[category]}
                    onClick={() => handlePageChange(category, currentPage[category] - 1)}
                  >
                    {t('previous')}
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    {currentPage[category]} / {totalPages(category)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage[category] >= totalPages(category) || loading[category]}
                    onClick={() => handlePageChange(category, currentPage[category] + 1)}
                  >
                    {t('next')}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{t('dashboard')} - Event Guestbook Platform</title>
        <meta name="description" content="Event dashboard with drag and drop functionality" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {/* {t('dragAndDropEvents')} */}
            {t('dashboardDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EventColumn
            title={t('pastEvents')}
            category="past"
            icon={Calendar}
            color="border-t-gray-400"
          />
          <EventColumn
            title={t('presentEvents')}
            category="present"
            icon={TrendingUp}
            color="border-t-green-600"
          />
          <EventColumn
            title={t('futureEvents')}
            category="future"
            icon={Calendar}
            color="border-t-blue-600"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;