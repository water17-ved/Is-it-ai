import React from 'react';
import {
  Flame,
  Clock,
  Play,
  ArrowRight,
  Target,
  CheckCircle2,
  ChevronRight,
  Bell,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Mission, UserProfile, NavTab } from '../types';
import { AppLogo } from './AppLogo';

interface CoachScreenProps {
  missions: Mission[];
  userProfile: UserProfile;
  onNavigate: (tab: NavTab) => void;
  onStartFocus: (mission: Mission) => void;
  onOpenMissionDetail: (mission: Mission) => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const CoachScreen: React.FC<CoachScreenProps> = ({
  missions,
  userProfile,
  onNavigate,
  onStartFocus,
  onOpenMissionDetail,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  // Find current active mission, queued missions, and next up
  const activeMission = missions.find((m) => m.status === 'active') || missions[0];
  const queuedMissions = missions.filter((m) => m.status === 'queued' && m.id !== activeMission?.id);
  const nextMission = queuedMissions[0];
  const followingMission = queuedMissions[1];

  // Daily statistics
  const totalCompletedQuestions = missions.reduce((acc, m) => acc + m.completedCount, 0);
  const targetQuestions = 50;
  const totalEstimatedMins = missions.reduce(
    (acc, m) => acc + (m.status !== 'completed' ? m.remainingMinutes : 0),
    0
  );
  const percentComplete = Math.min(100, Math.round((totalCompletedQuestions / targetQuestions) * 100));

  const activeProgress = activeMission
    ? Math.round((activeMission.completedCount / activeMission.totalQuestions) * 100)
    : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-3 pb-24 overscroll-contain no-scrollbar">
      {/* Top App Header */}
      <header className="flex items-center justify-between py-2 mb-3 border-b border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shadow-sm">
            <AppLogo size={28} variant="mark" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-slate-100 tracking-tight">JEE Core</h1>
              <span className="text-[10px] bg-slate-900 text-slate-300 font-medium px-2 py-0.5 rounded-md border border-slate-800">
                {userProfile.targetExam}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Daily Study Planner & Coach</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">{userProfile.streakDays}d</span>
          </div>

          <button
            id="coach-notification-bell"
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white touch-press"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Main Status & Greeting */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Today's Focus
          </span>
          <span className="text-xs font-mono text-slate-400">
            {totalCompletedQuestions} / {targetQuestions} solved ({percentComplete}%)
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">
          Current Study Objective
        </h2>
      </section>

      {/* Active Mission Focus Hero Card */}
      {activeMission && (
        <section id="section-current-mission" className="mb-4">
          <div
            onClick={() => onOpenMissionDetail(activeMission)}
            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 transition-colors hover:border-slate-700 cursor-pointer touch-press relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-sky-950/70 border border-sky-800/60 text-sky-300 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>In Progress</span>
              </span>
              <span className="text-xs font-medium text-slate-400">
                {activeMission.subject}
              </span>
            </div>

            <h3 className="text-base font-semibold text-slate-100 tracking-tight mb-1">
              {activeMission.title}
            </h3>
            <p className="text-xs text-slate-400 mb-3.5">
              {activeMission.chapter} • High-yield PYQ sprint (2020–2024)
            </p>

            {/* Progress Metrics */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Questions: <span className="text-slate-200 font-mono font-medium">{activeMission.completedCount} / {activeMission.totalQuestions}</span>
                </span>
                <span className="text-slate-300 font-mono font-medium">{activeProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${activeProgress}%` }}
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>~{activeMission.remainingMinutes}m remaining</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartFocus(activeMission);
                }}
                className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm touch-press"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Session</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Priority Weak Area Notice (Clean, non-alarming advisory) */}
      <section className="mb-4">
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3.5 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-semibold text-slate-200">Recommended Focus</span>
              <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                High Priority
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Physics: Practice 10 PYQs in <strong className="text-slate-100 font-medium">Electrostatics & Gauss Law</strong> at a steady 2.5 min/question pace.
            </p>
          </div>
        </div>
      </section>

      {/* Daily Progress Overview Strip */}
      <section className="mb-4">
        <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-3">
          <div className="text-xs font-semibold text-slate-300 mb-2.5">
            Daily Performance Metrics
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Solved Today</p>
              <p className="text-sm font-semibold text-slate-100 font-mono mt-0.5">
                {totalCompletedQuestions} Qs
              </p>
            </div>
            <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Est. Study Left</p>
              <p className="text-sm font-semibold text-slate-100 font-mono mt-0.5">
                {totalEstimatedMins} min
              </p>
            </div>
            <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Accuracy Pace</p>
              <p className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">
                92%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Up Next Queue */}
      {(nextMission || followingMission) && (
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Upcoming Missions</span>
            <button
              type="button"
              onClick={() => onNavigate('mission')}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {nextMission && (
              <div
                onClick={() => onOpenMissionDetail(nextMission)}
                className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 hover:border-slate-700 cursor-pointer touch-press flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className="text-xs font-medium text-slate-200">{nextMission.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {nextMission.completedCount}/{nextMission.totalQuestions}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {nextMission.subject} • {nextMission.chapter}
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0 ml-2">
                  {nextMission.remainingMinutes}m
                </span>
              </div>
            )}

            {followingMission && (
              <div
                onClick={() => onOpenMissionDetail(followingMission)}
                className="rounded-xl bg-slate-900/40 border border-slate-800/60 p-3 hover:border-slate-700 cursor-pointer touch-press flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-medium text-slate-300 block mb-0.5">
                    {followingMission.title}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {followingMission.subject} • {followingMission.chapter}
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0 ml-2">
                  {followingMission.remainingMinutes}m
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Direct Mentor Query Access (Subtle, elegant card) */}
      <section className="mt-auto pt-1">
        <button
          id="ask-coach-thumb-button"
          type="button"
          onClick={() => onNavigate('chat')}
          className="w-full bg-slate-900 hover:bg-slate-850 text-slate-100 rounded-xl p-3 border border-slate-800 hover:border-slate-700 flex items-center justify-between touch-press shadow-sm"
        >
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Ask JEE Mentor</p>
              <p className="text-[11px] text-slate-400">Clear conceptual doubts or get exam tips</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </section>
    </div>
  );
};

