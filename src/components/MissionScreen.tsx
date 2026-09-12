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
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Mission Board</h2>
          <p className="text-xs text-slate-400">Targeted high-yield problem sprints</p>
        </div>

        <button
          id="create-mission-button-header"
          type="button"
          onClick={onCreateMissionClick}
          className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm touch-press"
        >
          <Plus className="w-3.5 h-3.5 text-sky-400" />
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors touch-press ${
              selectedSubject === sub
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Vertically Stacked Compact Mission Cards */}
      <div className="flex flex-col space-y-3">
        {filteredMissions.map((mission) => {
          const isCompleted = mission.status === 'completed';
          const progressPercent = Math.round(
            (mission.completedCount / mission.totalQuestions) * 100
          );

          const priorityBadgeClass =
            mission.priority === 'HIGH'
              ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
              : mission.priority === 'MEDIUM'
              ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';

          return (
            <div
              key={mission.id}
              id={`mission-card-${mission.id}`}
              onClick={() => onOpenMissionDetail(mission)}
              className={`rounded-xl border p-3.5 transition-colors cursor-pointer touch-press ${
                isCompleted
                  ? 'bg-slate-900/40 border-slate-850 opacity-75'
                  : mission.status === 'active'
                  ? 'bg-slate-900/90 border-slate-700 shadow-sm'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Subject & Priority */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      mission.subject === 'Physics'
                        ? 'bg-sky-400'
                        : mission.subject === 'Chemistry'
                        ? 'bg-emerald-400'
                        : 'bg-violet-400'
                    }`}
                  />
                  {mission.subject} • {mission.chapter}
                </span>

                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border ${priorityBadgeClass}`}
                >
                  {mission.priority}
                </span>
              </div>

              {/* Mission Name */}
              <h3 className="text-sm font-semibold text-slate-100 tracking-tight leading-snug">
                {mission.title}
              </h3>

              {/* Progress Count */}
              <div className="mt-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-mono text-[11px]">
                  {mission.completedCount} / {mission.totalQuestions} Questions
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {progressPercent}%
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-sky-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Estimated Time & Status */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {isCompleted ? 'Completed' : `${mission.remainingMinutes} min remaining`}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-medium uppercase tracking-wider ${
                    isCompleted
                      ? 'text-emerald-400'
                      : mission.status === 'active'
                      ? 'text-sky-400'
                      : 'text-slate-400'
                  }`}
                >
                  {mission.status}
                </span>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMissionDetail(mission);
                  }}
                  className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {isCompleted ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(mission.id);
                    }}
                    className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium touch-press"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartFocus(mission);
                    }}
                    className="inline-flex items-center space-x-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold touch-press"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{mission.completedCount > 0 ? 'Continue' : 'Start'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredMissions.length === 0 && (
          <div className="p-6 text-center rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-sm font-medium text-slate-300">No missions in this category</p>
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
          className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-xl p-3 flex items-center justify-center space-x-2 font-medium text-xs shadow-sm touch-press"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          <span>New Study Mission</span>
        </button>
      </div>
    </div>
  );
};
