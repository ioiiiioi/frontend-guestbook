import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Zap, Brain, Cpu, Sparkles, Power, PowerOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
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
} from "@/components/ui/alert-dialog"

const AISupercharges = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [models, setModels] = useState([
    { name: 'GPT-4 Turbo', icon: Brain, status: 'Active', requests: '1.2M', accuracy: '98.5%', color: 'from-green-400 to-emerald-600' },
    { name: 'Claude 3', icon: Sparkles, status: 'Not Active', requests: '0', accuracy: 'N/A', color: 'from-gray-400 to-gray-600' },
    { name: 'Gemini Pro', icon: Cpu, status: 'Active', requests: '643K', accuracy: '96.2%', color: 'from-blue-400 to-indigo-600' },
    { name: 'Custom Model', icon: Zap, status: 'Training', requests: '124K', accuracy: '94.1%', color: 'from-purple-400 to-pink-600' },
  ]);

  const handleToggleStatus = (modelName) => {
    // Mock API call
    const randomStatus = 200; // Happy path for this flow

    const targetModel = models.find(m => m.name === modelName);
    const newStatus = targetModel.status === 'Active' ? 'deactivated' : 'activated';

    if (randomStatus === 200) {
      toast({
        title: `✅ Success!`,
        description: `Model "${modelName}" has been ${newStatus}.`,
      });
      setModels(models.map(model => 
        model.name === modelName 
          ? { 
              ...model, 
              status: model.status === 'Active' ? 'Not Active' : 'Active',
              color: model.status === 'Active' ? 'from-gray-400 to-gray-600' : 'from-yellow-400 to-orange-600',
              requests: model.status === 'Active' ? '0' : '856K',
              accuracy: model.status === 'Active' ? 'N/A' : '97.8%',
            }
          : model
      ));
    } else {
        toast({
            variant: 'destructive',
            title: `🔥 Error ${randomStatus}`,
            description: t('actionFailed'),
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('aiSupercharges')} - Dashboard</title>
        <meta name="description" content="AI models and supercharges management" />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-blue-600 bg-clip-text text-transparent">
            {t('aiSupercharges')}
          </h2>
          <p className="text-muted-foreground mt-2">Monitor and manage AI model performance</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn("hover:shadow-2xl transition-all duration-300 hover:scale-105", model.status === 'Not Active' && 'opacity-70')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                        <model.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className={cn(`px-2 py-1 rounded-full text-xs font-medium`, {
                            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': model.status === 'Active',
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': model.status === 'Training',
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': model.status === 'Not Active',
                          })}>
                            {t(model.status.toLowerCase().replace(' ', ''))}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">API Requests</p>
                        <p className="text-2xl font-bold">{model.requests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{model.accuracy}</p>
                      </div>
                    </div>
                    {model.status !== 'Training' && (
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button 
                                variant={model.status === 'Active' ? 'destructive' : 'default'}
                                className={cn('w-full', model.status !== 'Active' && 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700')}
                              >
                                {model.status === 'Active' 
                                  ? <><PowerOff className="w-4 h-4 mr-2" />{t('deactivate')}</>
                                  : <><Power className="w-4 h-4 mr-2" />{t('activate')}</>
                                }
                              </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                You are about to {model.status === 'Active' ? 'deactivate' : 'activate'} the model "{model.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleToggleStatus(model.name)}>
                                Yes, continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AISupercharges;