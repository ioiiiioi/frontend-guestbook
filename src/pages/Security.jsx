import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Security = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const securityLogs = [
    { event: 'Successful Login', time: '2 hours ago', status: 'success', icon: CheckCircle },
    { event: 'Password Changed', time: '1 day ago', status: 'success', icon: CheckCircle },
    { event: 'Failed Login Attempt', time: '3 days ago', status: 'warning', icon: AlertTriangle },
    { event: 'API Key Generated', time: '5 days ago', status: 'success', icon: Key },
  ];

  const handleSecurityAction = (action) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('security')} - Dashboard</title>
        <meta name="description" content="Security settings and activity monitoring" />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-blue-600 bg-clip-text text-transparent">
            {t('security')}
          </h2>
          <p className="text-muted-foreground mt-2">Manage security settings and monitor activity</p>
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
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{t('securitySettings')}</CardTitle>
                    <CardDescription>Configure security preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor" className="cursor-pointer">{t('twoFactor')}</Label>
                  <Switch 
                    id="two-factor" 
                    checked={twoFactor}
                    onCheckedChange={setTwoFactor}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-alerts" className="cursor-pointer">Login Alerts</Label>
                  <Switch 
                    id="login-alerts" 
                    checked={loginAlerts}
                    onCheckedChange={setLoginAlerts}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="session-timeout" className="cursor-pointer">Auto Session Timeout</Label>
                  <Switch 
                    id="session-timeout" 
                    checked={sessionTimeout}
                    onCheckedChange={setSessionTimeout}
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
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Password Security</CardTitle>
                    <CardDescription>Manage your password</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-accent">
                  <p className="text-sm text-muted-foreground mb-2">Password Strength</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                      />
                    </div>
                    <span className="text-sm font-medium">Strong</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSecurityAction('change-password')}
                  variant="outline" 
                  className="w-full"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Security Activity Log</CardTitle>
              <CardDescription>Recent security events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:shadow-md transition-all"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.status === 'success' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      <log.icon className={`w-5 h-5 ${
                        log.status === 'success' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.event}</p>
                      <p className="text-sm text-muted-foreground">{log.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Security Recommendation</h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    We recommend enabling two-factor authentication and reviewing your security logs regularly to keep your account secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Security;