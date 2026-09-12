import React from 'react';
import { Compass, MessageSquare, CheckSquare, BarChart3, Settings } from 'lucide-react';
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
    { id: 'coach' as NavTab, label: 'Today', icon: Compass },
    { id: 'mission' as NavTab, label: 'Missions', icon: CheckSquare },
    { id: 'chat' as NavTab, label: 'Mentor', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'history' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Bottom Navigation"
      className="shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-900 px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] z-40"
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
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl min-h-[48px] touch-press transition-colors ${
                isActive
                  ? 'text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center mb-1">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-sky-500 text-slate-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-slate-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

