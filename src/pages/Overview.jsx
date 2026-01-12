import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, BarChart, HardDrive, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Overview = () => {
  const { t } = useLanguage();

  const stats = [
    { title: t('tokenUsage'), value: '4.2M', icon: Activity, color: 'text-green-600', change: '+15.2%' },
    { title: t('remainingTokens'), value: '15.8M', icon: HardDrive, color: 'text-blue-600', change: '80% left' },
    { title: t('aiTokenSpend'), value: '$1,230', icon: BarChart, color: 'text-yellow-600', change: '+30.1%' },
    { title: t('totalUsers'), value: '12,543', icon: Users, color: 'text-purple-600', change: '+12.5%' },
  ];

  return (
    <>
      <Helmet>
        <title>{t('overview')} - Dashboard</title>
        <meta name="description" content="Dashboard overview with key metrics and statistics" />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-blue-600 bg-clip-text text-transparent">
            {t('welcome')}
          </h2>
          <p className="text-muted-foreground mt-2">Here's how your AI services are performing.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:scale-105 transition-transform duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('recentActivity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { activity: 'New app "Legacy CRM" connected.', time: '15 mins ago' },
                    { activity: 'Token usage spiked by 20%.', time: '1 hour ago' },
                    { activity: 'Model "GPT-4 Turbo" updated.', time: '5 hours ago' },
                    { activity: 'New user "Alex" signed up.', time: '1 day ago' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('integrationHealth')}</CardTitle>
                <CardDescription>{t('monitorServiceStatus')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">{t('allSystemsOperational')}</p>
                        <p className="text-sm text-muted-foreground">All integrations are running smoothly.</p>
                    </div>
                  </div>
                  {['API Gateway', 'AI Engine', 'Database Sync'].map((metric, index) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>{metric}</span>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           <span className="font-medium text-green-600">Operational</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Overview;