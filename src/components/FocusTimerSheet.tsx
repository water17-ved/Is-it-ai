import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Check, Plus, Minus, Volume2, Sparkles } from 'lucide-react';
import { Mission } from '../types';

interface FocusTimerSheetProps {
  mission: Mission | null;
  onUpdateMissionProgress: (missionId: string, questionsAdded: number) => void;
  onClose: () => void;
}

export const FocusTimerSheet: React.FC<FocusTimerSheetProps> = ({
  mission,
  onUpdateMissionProgress,
  onClose,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionQuestionsSolved, setSessionQuestionsSolved] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Set initial remaining time when duration changes
  const selectDuration = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            // Trigger audio beep if audio context allowed
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(880, ctx.currentTime);
              osc.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.35);
            } catch (e) {
              // Ignore audio error
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(durationMinutes * 60);
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(durationMinutes * 60);
  };

  const handleAddQuestion = () => {
    setSessionQuestionsSolved((prev) => prev + 1);
    if (mission) {
      onUpdateMissionProgress(mission.id, 1);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = durationMinutes * 60;
  const progressRatio = totalSecs > 0 ? (totalSecs - secondsRemaining) / totalSecs : 0;
  const circumference = 2 * Math.PI * 105;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-2 text-center select-none">
      {/* Attached Mission Name (Prompt requirement: "When a mission is attached, show the mission name above the timer.") */}
      {mission ? (
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 mb-4 text-left">
          <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-0.5">
            <span>CURRENT FOCUS MISSION</span>
            <span className="text-slate-300">{mission.subject}</span>
          </div>
          <h4 className="text-base font-bold text-white tracking-tight leading-snug">
            {mission.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 flex items-center justify-between">
            <span>{mission.chapter}</span>
            <span className="font-mono font-bold text-cyan-400">
              {mission.completedCount} / {mission.totalQuestions} solved
            </span>
          </p>
        </div>
      ) : (
        <div className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
          Independent Focus Sprint
        </div>
      )}

      {/* Preset Duration Pills */}
      <div className="flex items-center space-x-2 mb-4">
        {[15, 25, 45, 60].map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => selectDuration(mins)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all touch-press ${
              durationMinutes === mins
                ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Visually Prominent Timer (Prompt requirement: "The timer itself should be visually prominent.") */}
      <div className="relative w-64 h-64 flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
          <circle
            cx="120"
            cy="120"
            r="105"
            className="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="120"
            cy="120"
            r="105"
            className="stroke-cyan-400 transition-all duration-300 ease-linear"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-1">
            {isRunning ? 'Focused Deep Work' : secondsRemaining === 0 ? 'Session Complete!' : 'Ready to Start'}
          </span>
        </div>
      </div>

      {/* Controls: PAUSE, RESUME, RESET (Prompt requirement) */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-4">
        {isRunning ? (
          <button
            id="timer-pause-btn"
            type="button"
            onClick={handlePause}
            className="col-span-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-lg shadow-amber-500/20 touch-press"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            id="timer-resume-btn"
            type="button"
            onClick={handleResume}
            className="col-span-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-lg shadow-cyan-500/25 touch-press"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{secondsRemaining === durationMinutes * 60 ? 'START' : 'RESUME'}</span>
          </button>
        )}

        <button
          id="timer-reset-btn"
          type="button"
          onClick={handleReset}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-3 rounded-2xl flex items-center justify-center space-x-1 text-sm border border-slate-700 touch-press"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET</span>
        </button>
      </div>

      {/* In-Session Rapid Question Log Button */}
      <div className="w-full max-w-xs mt-3 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-between touch-press"
        >
          <div className="flex items-center space-x-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Solved a Question? Log Progress</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold">
            +{sessionQuestionsSolved} this session
          </span>
        </button>
      </div>
    </div>
  );
};
