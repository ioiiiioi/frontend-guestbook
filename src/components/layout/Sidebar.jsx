import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  AppWindow, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useLanguage();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: t('overview') },
    { path: '/users', icon: Users, label: t('users') },
    { path: '/ai-supercharges', icon: Zap, label: t('aiSupercharges') },
    { path: '/application', icon: AppWindow, label: t('application') },
    { path: '/settings', icon: Settings, label: t('settings') },
    { path: '/security', icon: Shield, label: t('security') },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative sidebar-gradient text-white shadow-2xl"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-300" />
                </div>
                <span className="font-bold text-xl">Dashboard</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200',
                  'hover:bg-white/10 hover:translate-x-1',
                  isActive && 'bg-white/20 shadow-lg'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('w-5 h-5', isActive && 'text-yellow-300')} />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <p className="text-sm font-medium mb-1">Futuristic Dashboard</p>
                <p className="text-xs text-white/70">v1.0.0</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;