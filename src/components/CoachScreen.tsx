import React from 'react';
import {
  Flame,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Bell,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Mission, UserProfile, NavTab } from '../types';

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
  // Find current active mission (NOW), next queued mission (NEXT), and following mission (AFTER THAT)
  const activeMission = missions.find((m) => m.status === 'active') || missions[0];
  const queuedMissions = missions.filter((m) => m.status === 'queued');
  const nextMission = queuedMissions[0];
  const afterThatMission = queuedMissions[1] || missions.find((m) => m.status === 'completed');

  // Daily calculation
  const totalCompletedQuestions = missions.reduce((acc, m) => acc + m.completedCount, 0);
  const totalEstimatedMins = missions.reduce((acc, m) => acc + (m.status !== 'completed' ? m.remainingMinutes : 0), 0);
  const percentComplete = Math.min(100, Math.round((totalCompletedQuestions / 70) * 100));

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-3 pb-24 overscroll-contain no-scrollbar">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-1 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <span className="text-white font-black text-xs tracking-tighter">JC</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-extrabold text-slate-100 tracking-tight">JEE CORE</h1>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 font-semibold px-1.5 py-0.5 rounded border border-cyan-800/60">
                {userProfile.targetExam.replace('JEE ', '')}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Your JEE Preparation Command Center</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-400">{userProfile.streakDays}d</span>
          </div>
          <button
            id="coach-notification-bell"
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white touch-press"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Primary Coach Question Prompt */}
      <div className="mt-1 mb-3">
        <p className="text-[11px] uppercase tracking-wider font-bold text-cyan-400/90">
          Command Center
        </p>
        <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
          WHAT SHOULD I DO NOW?
        </h2>
      </div>

      {/* 1. CURRENT PRIORITY */}
      <section id="section-current-priority" className="mb-3">
        <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border border-red-500/40 p-3 shadow-lg shadow-red-950/20">
          <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>1. Current Priority</span>
            <span className="ml-auto bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded-full font-black border border-red-500/30">
              URGENT
            </span>
          </div>
          <p className="text-sm font-bold text-slate-100 mt-1.5 leading-snug">
            Physics Weak Area: {activeMission?.chapter || 'Electrostatics Gauss Law'}
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Target: Solve 13 PYQs (2021–2024) with strict 2.5 min/question pace.
          </p>
        </div>
      </section>

      {/* 2. CURRENT MISSION */}
      {activeMission && (
        <section id="section-current-mission" className="mb-3">
          <div
            onClick={() => onOpenMissionDetail(activeMission)}
            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 shadow-md hover:border-slate-700 transition-colors cursor-pointer touch-press"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                2. Current Mission
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {activeMission.subject}
              </span>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight">
              {activeMission.title}
            </h3>

            {/* Progress Count */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-mono font-bold">
                {activeMission.completedCount} / {activeMission.totalQuestions} Questions
              </span>
              <span className="text-cyan-400 font-bold">
                {Math.round((activeMission.completedCount / activeMission.totalQuestions) * 100)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(activeMission.completedCount / activeMission.totalQuestions) * 100}%`,
                }}
              />
            </div>

            {/* Meta and Quick Thumb Action */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeMission.remainingMinutes} min remaining</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartFocus(activeMission);
                }}
                className="inline-flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md shadow-cyan-500/25 touch-press"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START FOCUS</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. PROGRESS SUMMARY */}
      <section id="section-progress" className="mb-3">
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>3. Today's Progress</span>
            <span className="text-slate-300">{percentComplete}% Goal Met</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Done</p>
              <p className="text-sm font-bold text-white font-mono mt-0.5">
                {totalCompletedQuestions} Qs
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</p>
              <p className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                {totalEstimatedMins}m
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</p>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                92%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NOW (Immediate Action) */}
      <section id="section-now" className="mb-3">
        <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 p-3">
          <div className="flex items-center justify-between text-xs font-bold text-blue-400 mb-1">
            <span className="uppercase tracking-wider">4. NOW</span>
            <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded font-bold">
              Immediate
            </span>
          </div>
          <p className="text-sm font-bold text-white">
            {activeMission ? `Solve next 5 PYQs in ${activeMission.title}` : 'Select a mission from tab'}
          </p>
          <p className="text-xs text-slate-300 mt-0.5">
            Focus Block: 25 minutes pomodoro timer ready to initiate.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => activeMission && onStartFocus(activeMission)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center space-x-1.5 touch-press"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Focus Timer (25m)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. NEXT (Up next queue) */}
      {nextMission && (
        <section id="section-next" className="mb-3">
          <div
            onClick={() => onOpenMissionDetail(nextMission)}
            className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 hover:border-slate-700 cursor-pointer touch-press"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span className="text-amber-400 uppercase tracking-wider">5. NEXT</span>
              <span className="text-slate-400 text-[11px]">{nextMission.remainingMinutes} min</span>
            </div>
            <p className="text-sm font-bold text-white">{nextMission.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {nextMission.chapter} • {nextMission.completedCount}/{nextMission.totalQuestions} completed
            </p>
          </div>
        </section>
      )}

      {/* 6. AFTER THAT */}
      {afterThatMission && (
        <section id="section-after-that" className="mb-4">
          <div
            onClick={() => onOpenMissionDetail(afterThatMission)}
            className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-3 hover:border-slate-700 cursor-pointer touch-press"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span className="text-slate-400 uppercase tracking-wider">6. AFTER THAT</span>
              <span className="text-slate-400 text-[11px]">{afterThatMission.remainingMinutes} min</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{afterThatMission.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {afterThatMission.chapter} • Priority: {afterThatMission.priority}
            </p>
          </div>
        </section>
      )}

      {/* 7. ASK COACH (Thumb-accessible bottom floating pill) */}
      <section id="section-ask-coach" className="sticky bottom-2 z-20 mt-auto">
        <button
          id="ask-coach-thumb-button"
          type="button"
          onClick={() => onNavigate('chat')}
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white rounded-2xl p-3 shadow-xl shadow-cyan-950/50 flex items-center justify-between border border-cyan-400/40 touch-press"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-200" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-cyan-200 font-bold uppercase tracking-wider">7. Direct Mentorship</p>
              <p className="text-xs font-extrabold text-white">Ask Coach: "How should I crack this doubt?"</p>
            </div>
          </div>
          <div className="bg-white/20 p-1.5 rounded-xl">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </button>
      </section>
    </div>
  );
};
