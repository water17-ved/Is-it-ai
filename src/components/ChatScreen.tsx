import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  Loader2,
  BookOpen,
  HelpCircle,
  BrainCircuit,
} from 'lucide-react';
import { ChatMessage, UserProfile, Mission } from '../types';

interface ChatScreenProps {
  userProfile: UserProfile;
  currentMission?: Mission;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  userProfile,
  currentMission,
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  error,
  onRetry,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const quickPrompts = [
    'Explain Gauss Law shell potential doubt',
    '3-step attack plan for Kinetics rate laws',
    "Formula shortcut for King's Rule in Integrals",
    'Diagnose my weak areas for JEE 2026',
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Mobile Sticky Chat App Bar */}
      <div className="shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold text-white leading-tight">JEE Coach</h2>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 font-semibold px-1.5 py-0.2 rounded border border-cyan-800/40">
                AI MENTOR
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {userProfile.mentorTone} • {userProfile.targetExam}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearChat}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors touch-press text-xs flex items-center gap-1"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 no-scrollbar overscroll-contain">
        {/* Mission Context Banner if active */}
        {currentMission && (
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">
                Active Focus: <strong className="text-white">{currentMission.title}</strong>
              </span>
            </div>
            <span className="text-cyan-400 font-mono font-bold shrink-0">
              {currentMission.completedCount}/{currentMission.totalQuestions}
            </span>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-br-xs shadow-md shadow-cyan-950/30 font-medium'
                    : 'bg-slate-900 text-slate-200 rounded-bl-xs border border-slate-800 shadow-sm'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center space-x-1.5 mb-1 pb-1 border-b border-slate-800 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Coach Guidance</span>
                  </div>
                )}

                <div className="markdown-body space-y-1.5 font-normal">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>

              <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* AI Thinking / Progress state */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="rounded-2xl rounded-bl-xs bg-slate-900 border border-slate-800 px-3.5 py-2.5 flex items-center space-x-2 text-xs text-cyan-400 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-slate-300 font-medium animate-pulse">
                Coach is formulating JEE strategy...
              </span>
            </div>
          </div>
        )}

        {/* Error / Retry State */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="ml-2 px-2.5 py-1 bg-red-500/20 text-red-200 border border-red-500/40 rounded-lg font-bold text-[11px] touch-press shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel (Above keyboard input) */}
      <div className="shrink-0 px-3 py-1.5 bg-slate-950/90 border-t border-slate-800/60 overflow-x-auto flex space-x-2 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPrompt(prompt)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap touch-press transition-colors font-medium flex items-center space-x-1 shrink-0"
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Anchored Keyboard-Aware Input Bar */}
      <div className="shrink-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 z-20">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask concept doubt, problem trick, or formula..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
          />

          <button
            id="chat-send-button"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 flex items-center justify-center transition-all shadow-md shadow-cyan-500/20 touch-press shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};
