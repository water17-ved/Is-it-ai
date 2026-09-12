import React, { useState } from 'react';
import { Sparkles, Plus, Clock, Target, AlertCircle, Loader2 } from 'lucide-react';
import { Mission, Subject, Priority } from '../types';

interface CreateMissionSheetProps {
  onCreateMission: (mission: Partial<Mission>) => void;
  onClose: () => void;
}

export const CreateMissionSheet: React.FC<CreateMissionSheetProps> = ({
  onCreateMission,
  onClose,
}) => {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(45);
  const [priority, setPriority] = useState<Priority>('HIGH');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateMission({
      title: title.trim(),
      subject,
      chapter: chapter.trim() || title.trim(),
      totalQuestions: Number(questionCount) || 15,
      completedCount: 0,
      estimatedMinutes: Number(estimatedMinutes) || 45,
      remainingMinutes: Number(estimatedMinutes) || 45,
      priority,
      status: 'active',
      keyConcepts: [`Key formulas for ${chapter || title}`, 'Timed accuracy practice'],
      actionSteps: [`Solve ${questionCount} PYQs under timer`],
      questions: [],
    });
    onClose();
  };

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    setAiError(null);

    try {
      const res = await fetch('/api/generate-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic: aiTopic,
          difficulty: 'Medium',
          availableMinutes: estimatedMinutes,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate mission');
      const data = await res.json();

      onCreateMission({
        title: data.title || `${aiTopic} PYQ Sprint`,
        subject: data.subject || subject,
        chapter: data.chapter || aiTopic,
        totalQuestions: data.questionCount || 15,
        completedCount: 0,
        estimatedMinutes: data.estimatedMinutes || estimatedMinutes,
        remainingMinutes: data.estimatedMinutes || estimatedMinutes,
        priority: (data.priority as Priority) || 'HIGH',
        status: 'active',
        keyConcepts: data.keyConcepts || [],
        actionSteps: data.actionSteps || [],
        questions: [],
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setAiError('Could not reach Gemini service. Created manual draft instead.');
      // Create reasonable draft
      onCreateMission({
        title: `${aiTopic} High-Yield Sprint`,
        subject,
        chapter: aiTopic,
        totalQuestions: 15,
        completedCount: 0,
        estimatedMinutes,
        remainingMinutes: estimatedMinutes,
        priority: 'HIGH',
        status: 'active',
        keyConcepts: ['Standard JEE Mains & Adv pyqs', 'Error prevention notes'],
        actionSteps: ['Target 15 questions in 45m'],
        questions: [],
      });
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-4">
      {/* Mode Switcher */}
      <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80">
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors touch-press ${
            mode === 'manual'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Manual Setup
        </button>
        <button
          type="button"
          onClick={() => setMode('ai')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 touch-press ${
            mode === 'ai'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
              : 'text-cyan-400 hover:text-cyan-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Auto-Plan</span>
        </button>
      </div>

      {mode === 'manual' ? (
        <form onSubmit={handleManualSubmit} className="space-y-3.5">
          {/* Subject Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubject(sub)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all touch-press ${
                    subject === sub
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Mission Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Optics Lens Maker Formula PYQs"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Chapter / Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Chapter / Unit
            </label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g., Ray Optics & Optical Instruments"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Numbers grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Target Questions
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Time (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="180"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['HIGH', 'MEDIUM', 'LOW'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all touch-press ${
                    priority === p
                      ? p === 'HIGH'
                        ? 'bg-red-500 text-white font-black'
                        : p === 'MEDIUM'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/20 touch-press mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE MISSION</span>
          </button>
        </form>
      ) : (
        <div className="space-y-3.5">
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
            <p className="font-bold flex items-center gap-1 mb-1 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Mission Architect</span>
            </p>
            <p className="text-slate-300 leading-relaxed">
              Enter any chapter, weak sub-topic, or formula area. Gemini will structure an optimal sprint with time limits and high-yield question counts.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubject(sub)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all touch-press ${
                    subject === sub
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Target Chapter or Sub-Topic
            </label>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. Thermodynamics Carnot Cycle or P-Block Inert Pair Effect"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Available Minutes
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setEstimatedMinutes(mins)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all touch-press ${
                    estimatedMinutes === mins
                      ? 'bg-blue-600 text-white font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {aiError && (
            <div className="flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          <button
            type="button"
            disabled={isGenerating || !aiTopic.trim()}
            onClick={handleAIGenerate}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25 touch-press"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Architecting High-Yield Mission...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE JEE MISSION</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
