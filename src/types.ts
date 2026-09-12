export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type MissionStatus = 'active' | 'queued' | 'completed';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuestionItem {
  id: string;
  questionText: string;
  subject: Subject;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  pyqYear?: string;
  completed: boolean;
  notes?: string;
}

export interface Mission {
  id: string;
  title: string;
  subject: Subject;
  chapter: string;
  completedCount: number;
  totalQuestions: number;
  estimatedMinutes: number;
  remainingMinutes: number;
  priority: Priority;
  status: MissionStatus;
  keyConcepts: string[];
  actionSteps: string[];
  questions: QuestionItem[];
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  status?: 'sending' | 'delivered' | 'error';
}

export interface NotificationItem {
  id: string;
  title: string;
  subText: string;
  message: string;
  missionId?: string;
  actionLabel?: string;
  timestamp: number;
  read: boolean;
}

export interface StudySession {
  id: string;
  missionId: string;
  missionTitle: string;
  subject: Subject;
  durationMinutes: number;
  questionsCompleted: number;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  targetExam: string;
  targetRank: string;
  mentorTone: 'Strict Guru' | 'Analytical Mentor' | 'Encouraging Coach';
  dailyGoalMinutes: number;
  weakAreas: string[];
  formulaBacklog: string[];
  notificationsEnabled: boolean;
  streakDays: number;
}

export type NavTab = 'coach' | 'chat' | 'mission' | 'history' | 'settings';
