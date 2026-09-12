import React, { useState } from 'react';
import {
  Plus,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Filter,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Mission, Subject, Priority } from '../types';

interface MissionScreenProps {
  missions: Mission[];
  onStartFocus: (mission: Mission) => void;
  onOpenMissionDetail: (mission: Mission) => void;
  onCreateMissionClick: () => void;
  onToggleComplete: (missionId: string) => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({
  missions,
  onStartFocus,
  onOpenMissionDetail,
  onCreateMissionClick,
  onToggleComplete,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredMissions = missions.filter((m) => {
    if (selectedSubject !== 'All' && m.subject !== selectedSubject) return false;
    if (selectedStatus !== 'All' && m.status !== selectedStatus) return false;
    return true;
  });

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics'];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-3 pb-24 overscroll-contain no-scrollbar">
      {/* Top Title & Quick Action */}
      <div className="flex items-center justify-between py-1 mb-2.5">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Mission Board</h2>
          <p className="text-xs text-slate-400">Targeted high-yield problem sprints</p>
        </div>

        <button
          id="create-mission-button-header"
          type="button"
          onClick={onCreateMissionClick}
          className="inline-flex items-center space-x-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 touch-press"
        >
          <Plus className="w-4 h-4" />
          <span>New Mission</span>
        </button>
      </div>

      {/* Subject Filter Chips - Thumb Horizontal Scroller */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1.5 mb-3 no-scrollbar shrink-0">
        {subjects.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-press ${
              selectedSubject === sub
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Vertically Stacked Compact Mission Cards (as required by prompt) */}
      <div className="flex flex-col space-y-3">
        {filteredMissions.map((mission) => {
          const isCompleted = mission.status === 'completed';
          const progressPercent = Math.round(
            (mission.completedCount / mission.totalQuestions) * 100
          );

          const priorityBadgeClass =
            mission.priority === 'HIGH'
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : mission.priority === 'MEDIUM'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

          return (
            <div
              key={mission.id}
              id={`mission-card-${mission.id}`}
              onClick={() => onOpenMissionDetail(mission)}
              className={`rounded-2xl border p-3.5 transition-all cursor-pointer touch-press ${
                isCompleted
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : mission.status === 'active'
                  ? 'bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Card Header: Subject & Priority */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      mission.subject === 'Physics'
                        ? 'bg-blue-400'
                        : mission.subject === 'Chemistry'
                        ? 'bg-emerald-400'
                        : 'bg-purple-400'
                    }`}
                  />
                  {mission.subject} • {mission.chapter}
                </span>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${priorityBadgeClass}`}
                >
                  {mission.priority}
                </span>
              </div>

              {/* Mission Name */}
              <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                {mission.title}
              </h3>

              {/* Progress Count (Prompt wireframe: "12 / 25") */}
              <div className="mt-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-mono font-bold">
                  {mission.completedCount} / {mission.totalQuestions}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {progressPercent}%
                </span>
              </div>

              {/* Visual Progress Bar (Prompt wireframe: ████████░░) */}
              <div className="w-full bg-slate-800 rounded-full h-2 mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Estimated Time & Status */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">
                    {isCompleted ? 'Completed' : `${mission.remainingMinutes} min remaining`}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isCompleted
                      ? 'text-emerald-400'
                      : mission.status === 'active'
                      ? 'text-cyan-400'
                      : 'text-slate-400'
                  }`}
                >
                  {mission.status}
                </span>
              </div>

              {/* Bottom Action Button (Prompt wireframe: [ CONTINUE ]) */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMissionDetail(mission);
                  }}
                  className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>

                {isCompleted ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(mission.id);
                    }}
                    className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold touch-press"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SOLVED</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartFocus(mission);
                    }}
                    className="inline-flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-black shadow-md shadow-cyan-500/20 touch-press"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{mission.completedCount > 0 ? 'CONTINUE' : 'START'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredMissions.length === 0 && (
          <div className="p-6 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-sm font-semibold text-slate-300">No missions in this category</p>
            <p className="text-xs text-slate-500 mt-1">Create a new mission or select another subject</p>
          </div>
        )}
      </div>

      {/* Floating Bottom Thumb Zone Create Mission Bar */}
      <div className="sticky bottom-2 z-20 mt-4">
        <button
          id="create-mission-fab"
          type="button"
          onClick={onCreateMissionClick}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-white rounded-2xl p-3 flex items-center justify-center space-x-2 font-bold text-xs shadow-lg touch-press"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Create Mission (Manual or AI Generate)</span>
        </button>
      </div>
    </div>
  );
};
