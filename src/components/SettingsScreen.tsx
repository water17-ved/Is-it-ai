import React, { useState } from 'react';
import {
  Brain,
  Database,
  Bell,
  Cpu,
  Save,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';
import { UserProfile, Mission } from '../types';
import { BottomSheet } from './BottomSheet';
import { AppLogo } from './AppLogo';

interface SettingsScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  missions: Mission[];
  onResetData: () => void;
  onShowNotificationSample: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  userProfile,
  onUpdateProfile,
  missions,
  onResetData,
  onShowNotificationSample,
}) => {
  const [activeSheet, setActiveSheet] = useState<
    'behaviour' | 'memory' | 'notifications' | 'gemini' | 'data' | 'about' | null
  >(null);

  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'checking' | 'active' | 'error'>('idle');
  const [newWeakArea, setNewWeakArea] = useState('');

  const checkGeminiPing = async () => {
    setGeminiStatus('checking');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setGeminiStatus('active');
      } else {
        setGeminiStatus('error');
      }
    } catch {
      setGeminiStatus('error');
    }
  };

  const handleExportData = () => {
    const backup = {
      profile: userProfile,
      missions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JEE_CORE_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddWeakArea = () => {
    if (!newWeakArea.trim()) return;
    const updated = [...userProfile.weakAreas, newWeakArea.trim()];
    onUpdateProfile({ weakAreas: updated });
    setNewWeakArea('');
  };

  const handleRemoveWeakArea = (index: number) => {
    const updated = userProfile.weakAreas.filter((_, i) => i !== index);
    onUpdateProfile({ weakAreas: updated });
  };

  const settingsList = [
    {
      id: 'behaviour' as const,
      title: 'AI Behaviour',
      desc: `Tone: ${userProfile.mentorTone} • ${userProfile.targetExam}`,
      icon: Brain,
      color: 'text-cyan-400',
    },
    {
      id: 'memory' as const,
      title: 'Memory',
      desc: `${userProfile.weakAreas.length} weak areas • ${userProfile.formulaBacklog.length} formula backlog`,
      icon: Database,
      color: 'text-amber-400',
    },
    {
      id: 'notifications' as const,
      title: 'Notifications',
      desc: userProfile.notificationsEnabled ? 'Active • Native Android channel' : 'Muted',
      icon: Bell,
      color: 'text-rose-400',
    },
    {
      id: 'gemini' as const,
      title: 'Gemini',
      desc: 'Model: gemini-3.8-flash • Server-side active',
      icon: Cpu,
      color: 'text-blue-400',
    },
    {
      id: 'data' as const,
      title: 'Data',
      desc: 'Backup, Export study logs, Reset default syllabus',
      icon: Save,
      color: 'text-emerald-400',
    },
    {
      id: 'about' as const,
      title: 'About',
      desc: 'JEE CORE v2.4.0 • Phone-First Android Center',
      icon: Info,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pt-3 pb-24 overscroll-contain no-scrollbar">
      {/* Header */}
      <div className="py-1 mb-3">
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">Settings</h2>
        <p className="text-xs text-slate-400">Preferences & system configurations</p>
      </div>

      {/* Clean Vertical List */}
      <div className="space-y-2">
        {settingsList.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`settings-item-${item.id}`}
              type="button"
              onClick={() => {
                setActiveSheet(item.id);
                if (item.id === 'gemini') checkGeminiPing();
              }}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-xl flex items-center justify-between transition-colors touch-press text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700/60 shrink-0 text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-100 leading-tight">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
            </button>
          );
        })}
      </div>

      {/* 1. AI BEHAVIOUR BOTTOM SHEET */}
      <BottomSheet
        isOpen={activeSheet === 'behaviour'}
        onClose={() => setActiveSheet(null)}
        title="AI Behaviour"
        subtitle="Customize mentor style and preparation targets"
      >
        <div className="space-y-4 pb-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Mentor Persona Tone
            </label>
            <div className="space-y-2">
              {[
                {
                  tone: 'Analytical Mentor' as const,
                  desc: 'Objective, data-driven, breaks concepts down into mathematical logic.',
                },
                {
                  tone: 'Strict Guru' as const,
                  desc: 'Zero tolerance for excuses. Demands timed sprints and daily discipline.',
                },
                {
                  tone: 'Encouraging Coach' as const,
                  desc: 'Warm, positive reinforcement with calm mental reframing during stress.',
                },
              ].map((item) => (
                <button
                  key={item.tone}
                  type="button"
                  onClick={() => onUpdateProfile({ mentorTone: item.tone })}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all touch-press ${
                    userProfile.mentorTone === item.tone
                      ? 'bg-cyan-950/50 border-cyan-400 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <p className="font-bold text-white">{item.tone}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Target JEE Exam Year
            </label>
            <input
              type="text"
              value={userProfile.targetExam}
              onChange={(e) => onUpdateProfile({ targetExam: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Target Rank / Percentile
            </label>
            <input
              type="text"
              value={userProfile.targetRank}
              onChange={(e) => onUpdateProfile({ targetRank: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </BottomSheet>

      {/* 2. MEMORY BOTTOM SHEET */}
      <BottomSheet
        isOpen={activeSheet === 'memory'}
        onClose={() => setActiveSheet(null)}
        title="AI Memory & Knowledge Bank"
        subtitle="Concepts and formula backlogs the coach keeps in focus"
      >
        <div className="space-y-4 pb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Tracked Weak Areas
            </h4>
            <div className="space-y-1.5 mb-2">
              {userProfile.weakAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200"
                >
                  <span>{area}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWeakArea(idx)}
                    className="text-red-400 hover:text-red-300 text-[11px] font-bold ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newWeakArea}
                onChange={(e) => setNewWeakArea(e.target.value)}
                placeholder="Add weak topic (e.g. Fluids Surface Tension)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleAddWeakArea}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs touch-press"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Formula Backlog Debt
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
              {userProfile.formulaBacklog.map((formula, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{formula}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* 3. NOTIFICATIONS BOTTOM SHEET */}
      <BottomSheet
        isOpen={activeSheet === 'notifications'}
        onClose={() => setActiveSheet(null)}
        title="Android Notifications"
        subtitle="Native channel configuration & alerts"
      >
        <div className="space-y-4 pb-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
            <div>
              <p className="text-xs font-bold text-white">Enable Mission Reminders</p>
              <p className="text-[11px] text-slate-400">High-priority task alerts during study blocks</p>
            </div>
            <input
              type="checkbox"
              checked={userProfile.notificationsEnabled}
              onChange={(e) => onUpdateProfile({ notificationsEnabled: e.target.checked })}
              className="w-5 h-5 accent-cyan-500 rounded"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
            <p className="font-bold text-slate-300 mb-1">Simulate Native Android Push</p>
            <p className="text-slate-400 mb-3 text-[11px]">
              Trigger an authentic Android notification card to verify notification shade behavior.
            </p>
            <button
              type="button"
              onClick={() => {
                onShowNotificationSample();
                setActiveSheet(null);
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-xl text-xs touch-press"
            >
              Trigger Test Android Notification
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* 4. GEMINI BOTTOM SHEET */}
      <BottomSheet
        isOpen={activeSheet === 'gemini'}
        onClose={() => setActiveSheet(null)}
        title="Gemini AI Engine"
        subtitle="Server-side LLM connectivity & specs"
      >
        <div className="space-y-3 pb-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">Selected Model</span>
              <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono font-bold">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Fast, low-latency reasoning model optimized for real-time mobile JEE mentoring, doubt resolution, and structured PYQ generation.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Server Health Status</p>
              <p className="text-[11px] text-slate-400">
                {geminiStatus === 'checking'
                  ? 'Pinging API...'
                  : geminiStatus === 'active'
                  ? 'Healthy & Connected'
                  : 'Ready (Simulation Fallback active if no key)'}
              </p>
            </div>
            <button
              type="button"
              onClick={checkGeminiPing}
              className="px-3 py-1.5 bg-slate-700 text-white font-bold rounded-xl text-xs touch-press"
            >
              Ping Test
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* 5. DATA BOTTOM SHEET */}
      <BottomSheet
        isOpen={activeSheet === 'data'}
        onClose={() => setActiveSheet(null)}
        title="Data & Storage"
        subtitle="Export study progress and restore defaults"
      >
        <div className="space-y-3 pb-4 text-xs">
          <button
            type="button"
            onClick={handleExportData}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-3 rounded-xl flex items-center justify-between touch-press"
          >
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <p className="font-bold">Export Study Log JSON</p>
                <p className="text-[11px] text-slate-400">Save your progress offline</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset to high-yield sample missions & progress?')) {
                onResetData();
                setActiveSheet(null);
              }
            }}
            className="w-full bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 p-3 rounded-xl flex items-center justify-between touch-press"
          >
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-red-400" />
              <div className="text-left">
                <p className="font-bold">Reset to High-Yield Defaults</p>
                <p className="text-[11px] text-red-300/80">Reload curated 2024–2026 JEE PYQs</p>
              </div>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* 6. ABOUT BOTTOM SHEET */}
      <BottomSheet
        isOpen={activeSheet === 'about'}
        onClose={() => setActiveSheet(null)}
        title="About JEE CORE"
        subtitle="Your JEE Preparation Command Center"
      >
        <div className="space-y-3 pb-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5">
            <AppLogo size={52} variant="card" />
            <div>
              <h4 className="text-sm font-bold text-slate-100">JEE CORE v2.4.0</h4>
              <p className="text-sky-400 font-medium text-xs mt-0.5">
                Official App Emblem & Theme
              </p>
              <p className="text-slate-400 text-[11px] mt-1">
                Apex Monogram with Orbital Quantum Rings
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Designed specifically as a phone-first Android application. Engineered for one-handed operation on 360–430dp screens with zero cognitive clutter.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
            <p className="font-semibold text-slate-200">Device Target Matrix:</p>
            <p className="text-slate-400">• 360dp × 640dp (Standard Compact Phone)</p>
            <p className="text-slate-400">• 393dp × 852dp (Modern Portrait)</p>
            <p className="text-slate-400">• 412dp × 915dp (Pixel Standard)</p>
            <p className="text-slate-400">• 430dp × 932dp (Ultra Wide Phone)</p>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
