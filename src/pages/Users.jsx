import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, UserPlus, Mail, Phone, MapPin, UserX, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
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

const Users = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', location: 'New York, USA', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', location: 'London, UK', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 234 567 8902', location: 'Tokyo, Japan', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '+1 234 567 8903', location: 'Paris, France', status: 'Active' },
  ];

  const handleAction = (action, userName) => {
    // Mock API call
    const randomStatus = [200, 400, 401, 404, 500][Math.floor(Math.random() * 5)];
    
    if (randomStatus === 200) {
      toast({
        title: `✅ Success!`,
        description: `User "${userName}" has been ${action}.`,
      });
    } else {
      let errorDesc = t('actionFailed');
      if (randomStatus === 400) errorDesc = t('error400');
      if (randomStatus === 401) errorDesc = t('error401');
      if (randomStatus === 404) errorDesc = t('error404');
      if (randomStatus === 500) errorDesc = t('error500');
      toast({
        variant: 'destructive',
        title: `🔥 Error ${randomStatus}`,
        description: errorDesc,
      });
    }
  };

  const handleAddUser = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('users')} - Dashboard</title>
        <meta name="description" content="User management dashboard" />
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
              {t('userManagement')}
            </h2>
            <p className="text-muted-foreground mt-2">Manage and monitor all platform users</p>
          </div>
          <Button onClick={handleAddUser} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            {t('addUser')}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('searchUsers')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 via-yellow-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {user.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {user.status}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleAction('inactivated', user.name)}>
                           <UserX className="w-3 h-3 mr-1" /> {t('inactive')}
                        </Button>

                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-3 h-3 mr-1" /> {t('delete')}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user "{user.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleAction('deleted', user.name)}>
                                Yes, delete user
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Users;