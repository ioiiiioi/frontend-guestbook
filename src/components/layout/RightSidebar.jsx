import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { authenticatedFetch } from '@/lib/api';

const RightSidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date()); // Represents the month/year currently displayed
  const [selectedDate, setSelectedDate] = useState(new Date()); // Represents the specifically clicked date
  const [events, setEvents] = useState([]); // Changed from 'event' to 'events' for clarity

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const today = new Date(); // Get today's date in local timezone

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = async (day) => {
    // Create a new Date object for the selected day in the *current displayed month*
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);

    // Format the date to 'YYYY-MM-DD' ensuring it's for the local day, not UTC
    const formattedDate = `${newSelectedDate.getFullYear()}-${String(newSelectedDate.getMonth() + 1).padStart(2, '0')}-${String(newSelectedDate.getDate()).padStart(2, '0')}`;

    // API Placeholder
    try {
      console.log(`[API Call] Fetching events for ${formattedDate} from https://backend.ricefield-dev.cloud`);
      const response = await authenticatedFetch(`/events/slim/?start_date=${formattedDate}`);

      if (!response.ok) {
        throw new Error('Failed to fetch events'); // Changed from guests to events
      }

      const data = await response.json();

      // Assuming the API returns a list of events directly or inside a results property
      // Adjusting based on common DRF patterns, but safely handling array direct return too
      const eventData = Array.isArray(data.data) ? data.data : (data.data || []);
      
      // Map API response to component state structure if necessary
      // Assuming API returns fields like: id, name
      const formattedEvents = eventData.map(event => ({
        id: event.id,
        name: event.name || 'Unknown',
      }));

      setEvents(formattedEvents);
      
      toast({
        title: "Date Selected",
        description: `Checked events for ${formattedDate}`,
      });
    } catch (error) {
      console.error("Failed to fetch calendar events", error);
      toast({
        title: t('error'),
        description: "Failed to load events for selected date",
        variant: "destructive"
      });
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-l-lg hover:bg-green-700 transition-colors shadow-lg z-40"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.aside
      initial={{ width: 320 }}
      animate={{ width: 320 }}
      className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('calendar')}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousMonth}
              className="h-8 w-8"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {[...Array(startingDayOfWeek)].map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              
              // Compare year, month, and day parts for 'today'
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              // Compare year, month, and day parts for 'selected'
              const isSelected = 
                selectedDate && 
                day === selectedDate.getDate() &&
                currentDate.getMonth() === selectedDate.getMonth() &&
                currentDate.getFullYear() === selectedDate.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all duration-200 
                    ${isToday
                      ? 'bg-green-600 text-white font-bold shadow-lg ring-2 ring-green-400 ring-offset-1'
                      : isSelected 
                        ? 'bg-blue-600 text-white font-semibold shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              {t('upcomingEvents')}
            </p>
            {events.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-xs text-blue-700 dark:text-blue-300">
                {events.map((event) => (
                  <li key={event.id}>{event.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {t('noUpcomingEvents')}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;