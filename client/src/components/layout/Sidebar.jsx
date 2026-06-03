import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, LogOut, X, Wallet, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const sidebarVariants = {
    open: { width: 260, transition: { duration: 0.3, ease: 'easeInOut' } },
    closed: { width: 80, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const drawerVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-slate-300">
      {/* Header / Logo */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {(isOpen || isMobile) && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold font-heading bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
            >
              Expense<span className="text-indigo-400">Flow</span>
            </motion.span>
          )}
        </div>

        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-slate-800/80 text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* User Info (Minimal) */}
      {(isOpen || isMobile) && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-4 mx-4 mt-6 rounded-2xl bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm"
        >
          <p className="text-xs text-slate-500">Logged in as</p>
          <h4 className="font-semibold text-slate-200 truncate">{user.name}</h4>
          <p className="text-xs text-indigo-400 truncate">{user.email}</p>
        </motion.div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-400 border border-indigo-500/30 font-medium'
                  : 'hover:bg-slate-800/50 hover:text-slate-100 border border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            {(isOpen || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-sans"
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={logout}
          className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/25 transition-all group"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
          {(isOpen || isMobile) && (
            <span className="text-sm font-sans">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            {/* Sliding Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Sidebar (animated width)
  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      className="hidden md:block h-screen bg-slate-900/60 border-r border-slate-800/60 backdrop-blur-xl shrink-0 sticky top-0"
    >
      <SidebarContent />
    </motion.div>
  );
};

export default Sidebar;
