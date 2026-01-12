import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Mail, Globe, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('settings')} - Dashboard</title>
        <meta name="description" content="Application settings and preferences" />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-blue-600 bg-clip-text text-transparent">
            {t('settings')}
          </h2>
          <p className="text-muted-foreground mt-2">Customize your dashboard experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="cursor-pointer">Push Notifications</Label>
                  <Switch 
                    id="notifications" 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts" className="cursor-pointer">Email Alerts</Label>
                  <Switch 
                    id="email-alerts" 
                    checked={emailAlerts}
                    onCheckedChange={setEmailAlerts}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save" className="cursor-pointer">Auto Save</Label>
                  <Switch 
                    id="auto-save" 
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-2">Current Theme</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-2">Color Scheme</p>
                  <div className="flex gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-green-500" />
                    <div className="w-8 h-8 rounded-full bg-yellow-500" />
                    <div className="w-8 h-8 rounded-full bg-blue-500" />
                    <div className="w-8 h-8 rounded-full bg-white border" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Email Preferences</CardTitle>
                    <CardDescription>Configure email settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-accent">
                  <p className="text-sm text-muted-foreground">Primary Email</p>
                  <p className="font-medium">admin@dashboard.com</p>
                </div>
                <Button onClick={handleSaveSettings} variant="outline" className="w-full">
                  Update Email
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>Time zone and locale</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-accent">
                  <p className="text-sm text-muted-foreground">Time Zone</p>
                  <p className="font-medium">UTC +00:00</p>
                </div>
                <div className="p-4 rounded-lg bg-accent">
                  <p className="text-sm text-muted-foreground">Date Format</p>
                  <p className="font-medium">MM/DD/YYYY</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-end"
        >
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default Settings;