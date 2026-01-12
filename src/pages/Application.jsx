import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AppWindow, Key, Copy, PlusCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Application = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [connectedApps, setConnectedApps] = useState([
    { id: 1, name: 'Legacy ERP', token: 'erp-tok-xxxx-xxxx-xxxx-1234', method: 'API', icon: AppWindow, color: 'from-green-400 to-emerald-600' },
    { id: 2, name: 'Customer Portal', token: 'portal-tok-xxxx-xxxx-xxxx-5678', method: 'API', icon: AppWindow, color: 'from-blue-400 to-indigo-600' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '✅ ' + t('tokenCopied'),
    });
  };
  
  const handleConnectApp = (event) => {
    event.preventDefault();
    const appName = event.target.appName.value;
    if (!appName) return;

    // Mock API call and token generation
    const randomStatus = 200;
    
    if (randomStatus === 200) {
      const newApp = {
        id: connectedApps.length + 1,
        name: appName,
        token: `${appName.toLowerCase().replace(' ', '')}-tok-xxxx-xxxx-xxxx-${Math.floor(1000 + Math.random() * 9000)}`,
        method: 'API',
        icon: AppWindow,
        color: 'from-yellow-400 to-orange-600'
      };
      setConnectedApps([...connectedApps, newApp]);
      toast({
        title: `✅ Success!`,
        description: `Application "${appName}" connected successfully.`,
      });
      setIsDialogOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: `🔥 Error`,
        description: t('actionFailed'),
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <Helmet>
        <title>{t('application')} - Dashboard</title>
        <meta name="description" content={t('manageYourConnectedApps')} />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-blue-600 bg-clip-text text-transparent">
              {t('connectedApplications')}
            </h2>
            <p className="text-muted-foreground mt-2">{t('manageYourConnectedApps')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                {t('connectLegacyApp')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('connectLegacyApp')}</DialogTitle>
                <DialogDescription>
                  Provide a name for your application to generate a new API token.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleConnectApp} className="space-y-4">
                <div>
                  <Label htmlFor="appName">Application Name</Label>
                  <Input id="appName" name="appName" placeholder="e.g., My Legacy CRM" required />
                </div>
                <Button type="submit" className="w-full">Generate Token</Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {connectedApps.map((app) => (
            <motion.div variants={itemVariants} key={app.id}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription>Connection Method: {app.method}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <Label htmlFor={`token-${app.id}`}>{t('apiToken')}</Label>
                    <div className="flex items-center gap-2">
                      <Input id={`token-${app.id}`} value={app.token} readOnly className="font-mono text-xs" />
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(app.token)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-4">
                     <CheckCircle className="w-4 h-4" />
                     <span>Connected</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {connectedApps.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center p-12 border-dashed">
                <h3 className="text-xl font-semibold">No Connected Applications</h3>
                <p className="text-muted-foreground mt-2">Get started by connecting your first legacy application.</p>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Available Connection Methods</CardTitle>
              <CardDescription>Future-proof your integrations with upcoming methods.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/50 text-center">
                <h4 className="font-bold text-green-700 dark:text-green-300">REST API</h4>
                <p className="text-xs text-muted-foreground">Available Now</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-center opacity-60">
                <h4 className="font-bold">gRPC</h4>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-center opacity-60">
                <h4 className="font-bold">MCP</h4>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Application;