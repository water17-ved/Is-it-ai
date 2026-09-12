import React from 'react';
import { Home, MessageSquare, Target, BarChart2, Settings } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 0,
}) => {
  const navItems = [
    { id: 'coach' as NavTab, label: 'Coach', icon: Home },
    { id: 'chat' as NavTab, label: 'Chat', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'mission' as NavTab, label: 'Mission', icon: Target },
    { id: 'history' as NavTab, label: 'History', icon: BarChart2 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Bottom Navigation"
      className="shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 pt-1 pb-2 z-40"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl min-h-[50px] touch-press transition-all duration-150 ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active Indicator Background Pill (Material 3 style) */}
              <div
                className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-cyan-500/15 ring-1 ring-cyan-400/30' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
