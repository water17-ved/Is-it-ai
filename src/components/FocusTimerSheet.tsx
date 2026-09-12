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
      {/* Attached Mission Name */}
      {mission ? (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 text-left">
          <div className="flex items-center justify-between text-[11px] font-medium text-sky-400 mb-0.5">
            <span>Focus Target</span>
            <span className="text-slate-400">{mission.subject}</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-100 tracking-tight leading-snug">
            {mission.title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>{mission.chapter}</span>
            <span className="font-mono text-slate-300">
              {mission.completedCount} / {mission.totalQuestions} solved
            </span>
          </p>
        </div>
      ) : (
        <div className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">
          Independent Study Sprint
        </div>
      )}

      {/* Preset Duration Pills */}
      <div className="flex items-center space-x-2 mb-4">
        {[15, 25, 45, 60].map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => selectDuration(mins)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors touch-press ${
              durationMinutes === mins
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Visually Prominent Timer */}
      <div className="relative w-64 h-64 flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
          <circle
            cx="120"
            cy="120"
            r="105"
            className="stroke-slate-800/80"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="120"
            cy="120"
            r="105"
            className="stroke-sky-400 transition-all duration-300 ease-linear"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-bold font-mono tracking-tight text-slate-100">
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-xs font-medium tracking-wide text-slate-400 mt-1">
            {isRunning ? 'Focus in progress' : secondsRemaining === 0 ? 'Session Complete' : 'Ready to start'}
          </span>
        </div>
      </div>

      {/* Controls: Pause, Resume, Reset */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mt-4">
        {isRunning ? (
          <button
            id="timer-pause-btn"
            type="button"
            onClick={handlePause}
            className="col-span-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow-sm touch-press"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause Timer</span>
          </button>
        ) : (
          <button
            id="timer-resume-btn"
            type="button"
            onClick={handleResume}
            className="col-span-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow-sm touch-press"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{secondsRemaining === durationMinutes * 60 ? 'Start Session' : 'Resume'}</span>
          </button>
        )}

        <button
          id="timer-reset-btn"
          type="button"
          onClick={handleReset}
          className="bg-slate-900 hover:bg-slate-850 text-slate-300 font-medium py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1 text-xs border border-slate-800 touch-press"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* In-Session Rapid Question Log Button */}
      <div className="w-full max-w-xs mt-3 pt-3 border-t border-slate-850">
        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 text-xs font-medium flex items-center justify-between touch-press"
        >
          <div className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Log 1 Solved Question</span>
          </div>
          <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-mono text-[11px] font-medium">
            +{sessionQuestionsSolved}
          </span>
        </button>
      </div>
    </div>
  );
};
