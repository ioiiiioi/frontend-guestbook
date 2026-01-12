import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Users, 
  Search, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { authenticatedFetch } from '@/lib/api';
import { cn } from '@/lib/utils';

// Helper to format ISO string to datetime-local input format
const formatForInput = (isoString) => {
  if (!isoString) return '';
  return isoString.slice(0, 16);
};

// Extracted Dialog Component to prevent re-rendering issues causing animation glitches
const EventFormDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  mode, 
  formData, 
  handleChange, 
  setFormData, 
  t 
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {mode === 'create' ? t('createEvent') : t('editEvent')}
        </DialogTitle>
        <DialogDescription>
          {mode === 'create' ? t('fillEventDetails') : t('updateEventDetails')}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('eventTitle')}</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('enterEventTitle')}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">{t('startDate')}</Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">{t('endDate')}</Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Offline/Online Toggle */}
          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="is_offline"
              checked={formData.is_offline}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_offline: checked }))}
            />
            <Label htmlFor="is_offline">{t('isOffline')}</Label>
          </div>

          {/* Location Details (Conditional with Animation) */}
          <AnimatePresence initial={false}>
            {formData.is_offline && (
              <motion.div
                key="offline-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50 mt-2 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue_name">{t('venueName')}</Label>
                    <Input
                      id="venue_name"
                      name="venue_name"
                      value={formData.venue_name}
                      onChange={handleChange}
                      placeholder={t('enterVenueName')}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('city')}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={t('enterCity')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t('address')}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={t('enterAddress')}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="msg_template">{t('msgTemplate')}</Label>
              <textarea
                id="msg_template"
                name="msg_template"
                value={formData.msg_template}
                onChange={handleChange}
                placeholder={t('msgTemplatePlaceholder')}
                className={cn(
                  "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback_template">{t('feedbackTemplate')}</Label>
              <textarea
                id="feedback_template"
                name="feedback_template"
                value={formData.feedback_template}
                onChange={handleChange}
                placeholder={t('feedbackTemplatePlaceholder')}
                className={cn(
                  "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {mode === 'create' ? t('create') : t('update')}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

const EventList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  
  // Filter, Sort, and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // New Form Data Structure
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    is_offline: true,
    venue_name: '',
    address: '',
    city: '',
    msg_template: '',
    feedback_template: '',
  });

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage, sortOrder]); // Re-fetch when page or sort changes

  // Reset pagination when search changes (optional, usually triggers new search API call)
  // For this implementation, we will keep simple page navigation
  
  const fetchEvents = async (page) => {
    setIsLoading(true);
    try {
      // Build query string for pagination
      // Assuming API supports ?page=X query param. Adjust if different.
      const queryParams = new URLSearchParams({
        page: page,
        page_size: itemsPerPage, // Or however the API expects limit/size
        // Add sorting/search params here if API supports server-side filtering
        // ordering: sortOrder === 'date_desc' ? '-start_date' : 'start_date' 
      });

      const response = await authenticatedFetch(`/events/?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different API response structures for pagination
      // Case 1: DRF standard { count: 100, next: "...", previous: "...", results: [...] }
      // Case 2: Custom wrapper { data: [...], meta: { total_pages: 5, ... } }
      // Case 3: Simple array (no pagination)
      
      let eventsArray = [];
      let totalCount = 0;

      if (Array.isArray(data)) {
        eventsArray = data;
        totalCount = data.length;
      } else if (data.results && Array.isArray(data.results)) {
        // DRF Style
        eventsArray = data.results;
        totalCount = data.count;
      } else if (data.data && Array.isArray(data.data)) {
        // Custom wrapper style often seen in user's previous code snippets
        eventsArray = data.data;
        // If the API returns total count or total pages in meta, use it. 
        // Fallback: if we got a full page, assume there might be more, if less than full page, that's it.
        totalCount = data.total_count || data.count || (data.meta ? data.meta.total : 0) || 1000; // 1000 as fallback to allow next button if unknown
      }

      const formattedEvents = eventsArray.map(event => ({
        id: event.id,
        title: event.name || event.title || 'Untitled Event',
        // Preserve raw values for editing
        raw_start_date: event.start_date,
        raw_end_date: event.end_date,
        is_offline: event.is_offline !== undefined ? event.is_offline : true,
        venue_name: event.venue_name || '',
        address: event.address || '',
        city: event.city || '',
        msg_template: event.msg_template || '',
        feedback_template: event.feedback_template || '',
        guests: event.guests_count || event.guests || 0,
        
        // Display values
        display_date: event.start_date ? new Date(event.start_date).toLocaleDateString() : 'No Date',
        display_location: (event.is_offline !== false) 
          ? [event.venue_name, event.city].filter(Boolean).join(', ') || 'In-person' 
          : 'Online'
      }));
      
      setEvents(formattedEvents);

      // Calculate total pages based on count
      // If API returns direct total_pages, use that instead
      if (data.total_pages) {
         setTotalPages(data.total_pages);
      } else {
         setTotalPages(Math.ceil(totalCount / itemsPerPage) || 1);
      }
      
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: t('error'),
        description: t('failedToLoadEvents'),
        variant: 'destructive',
      });
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredAndSortedEvents = () => {
    // Client-side filtering for currently loaded page (since search isn't fully server-side integrated in this snippet)
    let filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'date_asc':
          return new Date(a.raw_start_date) - new Date(b.raw_start_date);
        case 'date_desc':
          return new Date(b.raw_start_date) - new Date(a.raw_start_date);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // With server-side pagination, we display what we fetched
  // Client-side filtering applies only to the current page view in this hybrid approach
  const currentEvents = getFilteredAndSortedEvents();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      start_date: '',
      end_date: '',
      is_offline: true,
      venue_name: '',
      address: '',
      city: '',
      msg_template: '',
      feedback_template: '',
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const processFormData = {
          "name": formData.title,
          "start_date": formData.start_date,
          "end_date": formData.end_date,
          "is_offline": formData.is_offline,
          "venue_name": formData.venue_name || null,
          "address": formData.address || null,
          "city": formData.city || null,
          "msg_template": formData.msg_template || null,
          "feedback_template": formData.feedback_template || null,
      };

      const response = await authenticatedFetch('/events/', {
        method: 'POST',
        body: JSON.stringify(processFormData),
      });

      if (response.status === 201) {
        setIsCreateOpen(false);
        resetForm();
        toast({ title: t('success'), description: t('eventCreated') });
        // Reload list to show new item
        fetchEvents(1);
        setCurrentPage(1);
      } else {
        const errorData = await response.json();
        console.error("Failed to create event:", errorData);
        toast({ 
          title: t('error'), 
          description: t('failedToCreateEvent'), 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({ title: t('error'), description: t('failedToCreateEvent'), variant: 'destructive' });
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      start_date: formatForInput(event.raw_start_date),
      end_date: formatForInput(event.raw_end_date),
      is_offline: event.is_offline,
      venue_name: event.venue_name || '',
      address: event.address || '',
      city: event.city || '',
      msg_template: event.msg_template || '',
      feedback_template: event.feedback_template || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const processFormData = {
          "name": formData.title,
          "start_date": formData.start_date,
          "end_date": formData.end_date,
          "is_offline": formData.is_offline,
          "venue_name": formData.venue_name || null,
          "address": formData.address || null,
          "city": formData.city || null,
          "msg_template": formData.msg_template || null,
          "feedback_template": formData.feedback_template || null,
      };

      console.log("Data: ", processFormData);

      const response = await authenticatedFetch(`/events/${selectedEvent.id}/`, {
         method: 'PATCH',
         body: JSON.stringify(processFormData)
      });

      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setEvents(events.map((event) =>
        event.id === selectedEvent.id ? { 
          ...event, 
          // Update internal fields
          title: processFormData.name,
          raw_start_date: processFormData.start_date,
          raw_end_date: processFormData.end_date,
          is_offline: processFormData.is_offline,
          venue_name: processFormData.venue_name || '',
          address: processFormData.address || '',
          city: processFormData.city || '',
          msg_template: processFormData.msg_template || '',
          feedback_template: processFormData.feedback_template || '',
          // Update display fields
          display_date: processFormData.start_date ? new Date(processFormData.start_date).toLocaleDateString() : 'No Date',
          display_location: processFormData.is_offline ? (processFormData.venue_name || 'In-person') : 'Online'
        } : event
      ));
      
      setIsEditOpen(false);
      setSelectedEvent(null);
      resetForm();
      toast({ title: t('success'), description: t('eventUpdated') });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({ title: t('error'), description: t('failedToUpdateEvent'), variant: 'destructive' });
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await authenticatedFetch(`/events/${eventId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setEvents(events.filter((event) => event.id !== eventId));
      
      // If this was the last item on the page and not the first page, go back one page
      if (events.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
      
      toast({ title: t('success'), description: t('eventDeleted') });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({ title: t('error'), description: t('failedToDeleteEvent'), variant: 'destructive' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('events')} - Event Guestbook Platform</title>
        <meta name="description" content="Manage your events" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('events')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('manageYourEvents')}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('createEvent')}
          </Button>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (Newest)</SelectItem>
                <SelectItem value="date_asc">Date (Oldest)</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <CardTitle className="text-lg line-clamp-1" title={event.title}>
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {event.display_date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    {event.guests} {t('guests')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <MapPin className="w-4 h-4 flex-shrink-0" />
                     <p className="line-clamp-1" title={event.display_location}>
                      {event.display_location}
                     </p>
                  </div>
                  
                  <div className="flex gap-2 pt-4 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t('view')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteEventConfirmation')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {currentEvents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('noEvents')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? 'Try adjusting your search query' : t('createFirstEvent')}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('createEvent')}
              </Button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 pb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <EventFormDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
          mode="create"
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          t={t}
        />

        <EventFormDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSubmit={handleUpdate}
          mode="edit"
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          t={t}
        />
      </div>
    </>
  );
};

export default EventList;