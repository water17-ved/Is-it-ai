import React, { useState } from 'react';
import {
  Clock,
  Play,
  CheckCircle2,
  ListOrdered,
  BookOpen,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Mission, QuestionItem } from '../types';

interface MissionDetailSheetProps {
  mission: Mission;
  onStartFocus: (mission: Mission) => void;
  onToggleQuestion: (missionId: string, questionId: string) => void;
  onToggleCompleteMission: (missionId: string) => void;
  onClose: () => void;
}

export const MissionDetailSheet: React.FC<MissionDetailSheetProps> = ({
  mission,
  onStartFocus,
  onToggleQuestion,
  onToggleCompleteMission,
  onClose,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: opt }));
  };

  const handleToggleReveal = (questionId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const isCompleted = mission.status === 'completed';

  return (
    <div className="flex flex-col space-y-4 pb-4">
      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between text-xs font-medium mb-1">
          <span className="text-sky-400">{mission.subject}</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
            {mission.priority} Priority
          </span>
        </div>
        <h3 className="text-base font-semibold text-slate-100 tracking-tight leading-snug">
          {mission.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {mission.chapter} • Est. {mission.estimatedMinutes} mins
        </p>

        {/* Progress status */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Progress: {mission.completedCount} / {mission.totalQuestions} Questions
          </span>
          <span className="text-slate-300 font-mono font-medium text-[11px]">
            {Math.round((mission.completedCount / mission.totalQuestions) * 100)}%
          </span>
        </div>
      </div>

      {/* Action Buttons in thumb zone */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            onStartFocus(mission);
            onClose();
          }}
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-sm touch-press"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Focus Timer</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleCompleteMission(mission.id)}
          className={`font-medium py-2.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 border touch-press ${
            isCompleted
              ? 'bg-slate-900 border-slate-800 text-slate-400'
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'Mark Active' : 'Mark Completed'}</span>
        </button>
      </div>

      {/* Key Concepts */}
      {mission.keyConcepts && mission.keyConcepts.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Key High-Yield Concepts</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {mission.keyConcepts.map((concept, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions & Taxonomy Breakdown */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
            <span>PYQ Questions & Practice Log</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            {mission.questions?.length || 0} loaded
          </span>
        </div>

        {mission.questions && mission.questions.length > 0 ? (
          <div className="space-y-2.5">
            {mission.questions.map((q, idx) => {
              const isExpanded = expandedQuestionId === q.id;
              const isSolved = q.completed;
              const selectedOpt = selectedAnswers[q.id];
              const isAnswerRevealed = revealedAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-3 transition-all ${
                    isSolved
                      ? 'bg-slate-900/40 border-slate-800'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <button
                        type="button"
                        onClick={() => onToggleQuestion(mission.id, q.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                          isSolved
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 hover:border-slate-400 text-transparent'
                        }`}
                        aria-label="Toggle question solved"
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-mono font-bold text-slate-300">Q{idx + 1}</span>
                        {q.pyqYear && (
                          <span className="bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">
                            {q.pyqYear}
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-slate-400 font-medium truncate max-w-[140px]">
                          {q.topic}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="text-slate-400 hover:text-white p-1 rounded"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 mt-2 font-medium leading-relaxed pl-7">
                    {q.questionText}
                  </p>

                  {/* Options (MCQs) if available */}
                  {q.options && q.options.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pl-7">
                      {q.options.map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx);
                        const isSelected = selectedOpt === opt;
                        const isCorrect = q.correctAnswer === opt;
                        let optStyle = 'bg-slate-800/60 border-slate-700/60 text-slate-300';

                        if (isAnswerRevealed) {
                          if (isCorrect) {
                            optStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 font-semibold';
                          } else if (isSelected) {
                            optStyle = 'bg-red-950/60 border-red-500/80 text-red-200';
                          }
                        } else if (isSelected) {
                          optStyle = 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt)}
                            className={`w-full text-left p-2 rounded-xl text-xs border flex items-center space-x-2 transition-colors touch-press ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-700/60 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                              {optLetter}
                            </span>
                            <span className="flex-1">{opt}</span>
                          </button>
                        );
                      })}

                      {/* Reveal Answer & Explanation Button */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleToggleReveal(q.id)}
                          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{isAnswerRevealed ? 'Hide Solution' : 'Check Solution'}</span>
                        </button>
                      </div>

                      {isAnswerRevealed && q.explanation && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200">
                          <p className="font-bold text-emerald-400 mb-1">
                            Correct: {q.correctAnswer}
                          </p>
                          <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No individual questions logged for this mission.</p>
        )}
      </div>
    </div>
  );
};
