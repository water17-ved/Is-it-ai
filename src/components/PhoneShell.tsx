import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Bell,
  ChevronLeft,
  Circle,
  Square,
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCw,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface PhoneShellProps {
  children: React.ReactNode;
  onBack: () => void;
  onHome: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  activeNotificationToast: NotificationItem | null;
  onDismissToast: () => void;
  onOpenMissionFromToast: (id: string) => void;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({
  children,
  onBack,
  onHome,
  onOpenNotifications,
  unreadCount,
  activeNotificationToast,
  onDismissToast,
  onOpenMissionFromToast,
}) => {
  // Supported phone screen targets from prompt
  const [phoneWidth, setPhoneWidth] = useState<number>(393);
  const [isFullScreenPhone, setIsFullScreenPhone] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Phone Target Preset Switcher Toolbar (Visible on desktop/preview for phone-first acceptance testing) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-lg mb-2.5 px-3 py-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 shadow-md">
        <div className="flex items-center space-x-1.5">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-[11px]">Android DP Target:</span>
        </div>

        <div className="flex items-center space-x-1">
          {[
            { label: '360dp', width: 360, title: '360dp × 800dp (Compact)' },
            { label: '393dp', width: 393, title: '393dp × 852dp (Standard)' },
            { label: '412dp', width: 412, title: '412dp × 915dp (Pixel)' },
            { label: '430dp', width: 430, title: '430dp × 932dp (Ultra)' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              title={item.title}
              onClick={() => {
                setPhoneWidth(item.width);
                setIsFullScreenPhone(false);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all touch-press ${
                phoneWidth === item.width && !isFullScreenPhone
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            title="Toggle native full screen"
            onClick={() => setIsFullScreenPhone((prev) => !prev)}
            className={`p-1 rounded-lg text-[10px] font-bold transition-all touch-press ${
              isFullScreenPhone
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isFullScreenPhone ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Android Smartphone Container */}
      <div
        style={{
          width: isFullScreenPhone ? '100vw' : undefined,
          maxWidth: isFullScreenPhone ? '100vw' : `${phoneWidth}px`,
          height: isFullScreenPhone ? '100vh' : 'min(92vh, 880px)',
        }}
        className={`w-full relative flex flex-col bg-slate-950 overflow-hidden transition-all duration-200 ${
          isFullScreenPhone
            ? 'h-screen rounded-none border-0'
            : 'rounded-[36px] border-[5px] border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-700/50'
        }`}
      >
        {/* Android Status Bar */}
        <div
          onClick={onOpenNotifications}
          className="shrink-0 h-8 px-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/90 backdrop-blur-sm z-30 cursor-pointer hover:bg-slate-900/50 transition-colors"
          title="Tap to open Android notification shade"
        >
          {/* Time & App notification indicator */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[11px] text-slate-200 tracking-tight font-mono">
              {currentTime}
            </span>
            {unreadCount > 0 && (
              <div className="flex items-center space-x-1">
                <Bell className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            )}
          </div>

          {/* Android Punch Hole Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner" />

          {/* Network, WiFi & Battery Icons */}
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center space-x-0.5">
              <span className="text-[10px] font-mono font-semibold">88%</span>
              <Battery className="w-4 h-4 fill-slate-300" />
            </div>
          </div>
        </div>

        {/* In-App Android Notification Heads-up Popover */}
        {activeNotificationToast && (
          <div className="absolute top-9 left-3 right-3 z-50 animate-in slide-in-from-top duration-200">
            <div className="rounded-2xl bg-slate-800/95 border border-cyan-500/50 p-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold mb-1">
                <span>JEE CORE • {activeNotificationToast.subText}</span>
                <button
                  type="button"
                  onClick={onDismissToast}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-bold text-white mb-2 leading-snug">
                {activeNotificationToast.message}
              </p>
              {activeNotificationToast.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeNotificationToast.missionId) {
                      onOpenMissionFromToast(activeNotificationToast.missionId);
                    }
                    onDismissToast();
                  }}
                  className="w-full bg-cyan-500 text-slate-950 text-xs font-black py-1.5 rounded-xl uppercase tracking-wider touch-press"
                >
                  {activeNotificationToast.actionLabel}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Phone Content Screen */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Navigation Gesture Bar / 3-Button Navigation (Prompt requirement) */}
        <div className="shrink-0 h-8 bg-slate-950 border-t border-slate-900 px-6 flex items-center justify-around z-30">
          <button
            type="button"
            id="android-back-button"
            onClick={onBack}
            className="p-1.5 text-slate-400 hover:text-cyan-400 touch-press"
            aria-label="Android Back"
            title="Back (Closes sheet or returns to Coach)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="android-home-button"
            onClick={onHome}
            className="p-1.5 text-slate-400 hover:text-cyan-400 touch-press"
            aria-label="Android Home"
            title="Home (Coach Screen)"
          >
            <Circle className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            type="button"
            id="android-recents-button"
            onClick={onOpenNotifications}
            className="p-1.5 text-slate-400 hover:text-cyan-400 touch-press"
            aria-label="Android Recents / Notifications"
            title="Notification Drawer"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
