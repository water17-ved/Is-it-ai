import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, ArrowRight, Check } from 'lucide-react';
import { NotificationItem, Mission } from '../types';

interface NotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onOpenMission: (missionId: string) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationShade: React.FC<NotificationShadeProps> = ({
  isOpen,
  onClose,
  notifications,
  onOpenMission,
  onDismiss,
  onClearAll,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Notification Shade Drawer (Sliding down from top) */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative w-full max-w-md mx-auto bg-slate-900 border-b border-slate-700/80 rounded-b-3xl shadow-2xl flex flex-col max-h-[85vh] z-10 overflow-hidden pt-[max(0.75rem,env(safe-area-inset-top))]"
          >
            {/* Header */}
            <div className="px-4 pt-2 pb-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  JEE CORE Notifications
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No pending notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  /* Prompt Example Exact Layout:
                     JEE CORE
                     Mission reminder
                     "Electrostatics PYQs" is waiting for you.
                     [OPEN MISSION]
                  */
                  <div
                    key={notif.id}
                    className="rounded-2xl bg-slate-800/90 border border-slate-700 p-3 text-left shadow-md"
                  >
                    {/* Channel & App Name Header */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="font-extrabold text-white">{notif.title}</span>
                        <span>•</span>
                        <span className="text-slate-400">{notif.subText}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDismiss(notif.id)}
                        className="text-slate-500 hover:text-slate-300 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Notification Message */}
                    <p className="text-xs font-semibold text-slate-100 my-1.5 leading-snug">
                      {notif.message}
                    </p>

                    {/* Action button */}
                    {notif.actionLabel && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (notif.missionId) onOpenMission(notif.missionId);
                            onDismiss(notif.id);
                            onClose();
                          }}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 rounded-xl text-[11px] font-black tracking-wide uppercase touch-press shadow-sm flex items-center space-x-1"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Bottom drag pill */}
            <div className="pb-2 pt-1 flex justify-center cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1 bg-slate-700 rounded-full" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
