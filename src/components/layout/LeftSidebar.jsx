import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar as CalendarIcon, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const LeftSidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useLanguage();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/events', icon: CalendarIcon, label: t('events') },
    { path: '/media', icon: Image, label: t('media') },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative sidebar-gradient text-white shadow-2xl flex flex-col h-screen"
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
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
                  <CalendarIcon className="w-6 h-6 text-yellow-300" />
                </div>
                <span className="font-bold text-xl">{t('eventGuestbook')}</span>
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

        <nav className="p-4 space-y-2 shrink-0">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
                        className="font-medium whitespace-nowrap"
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
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;