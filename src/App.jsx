import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import OTPVerification from '@/pages/OTPVerification';
import Dashboard from '@/pages/Dashboard';
import EventList from '@/pages/EventList';
import EventDetail from '@/pages/EventDetail';
import EventGuestList from '@/pages/EventGuestList';
import EventMedia from '@/pages/EventMedia';
import PublicQRCode from '@/pages/PublicQRCode';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Helmet>
              <title>Event Guestbook Platform</title>
              <meta name="description" content="Complete event management and guestbook platform with bilingual support" />
            </Helmet>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/qr/:eventId" element={<PublicQRCode />} />
              
              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="events" element={<EventList />} />
                <Route path="events/:eventId" element={<EventDetail />} />
                <Route path="events/:eventId/guests" element={<EventGuestList />} />
                <Route path="media" element={<EventMedia />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;