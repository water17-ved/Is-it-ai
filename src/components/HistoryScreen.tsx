import React, { useState } from 'react';
import {
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Mission, QuestionItem, UserProfile } from '../types';

interface HistoryScreenProps {
  missions: Mission[];
  userProfile: UserProfile;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ missions, userProfile }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Aggregate all questions across missions
  const allQuestions: QuestionItem[] = missions.flatMap((m) => m.questions || []);

  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  // Calculate subject counts
  const physicsSolved = missions
    .filter((m) => m.subject === 'Physics')
    .reduce((acc, m) => acc + m.completedCount, 0);
  const chemistrySolved = missions
    .filter((m) => m.subject === 'Chemistry')
    .reduce((acc, m) => acc + m.completedCount, 0);
  const mathSolved = missions
    .filter((m) => m.subject === 'Mathematics')
    .reduce((acc, m) => acc + m.completedCount, 0);
  const totalSolved = physicsSolved + chemistrySolved + mathSolved;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-3 pb-24 overscroll-contain no-scrollbar">
      {/* Header */}
      <div className="py-1 mb-3">
        <h2 className="text-xl font-extrabold text-white tracking-tight">Practice History</h2>
        <p className="text-xs text-slate-400">Mastery logs & question taxonomy</p>
      </div>

      {/* Streak & Consistency Compact Card */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 p-3.5 mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-extrabold text-white font-mono">
                {userProfile.streakDays} Days
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300">Target JEE Advanced 2026</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-cyan-400 font-mono">{totalSolved}</span>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Solved</p>
        </div>
      </div>

      {/* Subject Distribution Card (Compact, no desktop table) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 mb-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          <span>Subject Problem Ratio</span>
          <span className="text-slate-400">{totalSolved} PYQs</span>
        </div>

        {/* 3-Color Segmented Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full flex overflow-hidden mb-3">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${totalSolved ? (physicsSolved / totalSolved) * 100 : 33}%` }}
          />
          <div
            className="bg-emerald-500 h-full"
            style={{ width: `${totalSolved ? (chemistrySolved / totalSolved) * 100 : 33}%` }}
          />
          <div
            className="bg-purple-500 h-full"
            style={{ width: `${totalSolved ? (mathSolved / totalSolved) * 100 : 34}%` }}
          />
        </div>

        {/* Subject Breakdown Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
            <p className="text-[11px] font-bold text-blue-400">Physics</p>
            <p className="text-sm font-bold text-white font-mono mt-0.5">{physicsSolved} Qs</p>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
            <p className="text-[11px] font-bold text-emerald-400">Chemistry</p>
            <p className="text-sm font-bold text-white font-mono mt-0.5">{chemistrySolved} Qs</p>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
            <p className="text-[11px] font-bold text-purple-400">Maths</p>
            <p className="text-sm font-bold text-white font-mono mt-0.5">{mathSolved} Qs</p>
          </div>
        </div>
      </div>

      {/* Question Taxonomy Header & Filter Chips */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Question Taxonomy Bank</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {filteredQuestions.length} questions
          </span>
        </div>

        {/* Filters */}
        <div className="flex space-x-1.5 overflow-x-auto py-1 no-scrollbar">
          {['All', 'Physics', 'Chemistry', 'Mathematics'].map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all touch-press ${
                selectedSubject === sub
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Vertically Stacked Question Cards */}
      <div className="space-y-2.5">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 text-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300">
                {q.subject} • <span className="text-cyan-400">{q.chapter}</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  q.difficulty === 'Easy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : q.difficulty === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {q.difficulty}
              </span>
            </div>

            <p className="text-slate-200 font-medium line-clamp-2">{q.questionText}</p>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Topic: {q.topic}</span>
              <span className="flex items-center gap-1">
                {q.completed ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </span>
                ) : (
                  <span className="text-slate-500">Unsolved</span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
