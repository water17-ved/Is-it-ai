import React, { useState, useEffect } from 'react';
import {
  Mission,
  UserProfile,
  ChatMessage,
  NotificationItem,
  NavTab,
} from './types';
import {
  initialMissions,
  initialProfile,
  initialNotifications,
  initialChatMessages,
} from './data/initialData';
import { PhoneShell } from './components/PhoneShell';
import { BottomNavBar } from './components/BottomNavBar';
import { CoachScreen } from './components/CoachScreen';
import { MissionScreen } from './components/MissionScreen';
import { ChatScreen } from './components/ChatScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { FocusTimerSheet } from './components/FocusTimerSheet';
import { MissionDetailSheet } from './components/MissionDetailSheet';
import { CreateMissionSheet } from './components/CreateMissionSheet';
import { NotificationShade } from './components/NotificationShade';
import { BottomSheet } from './components/BottomSheet';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('coach');

  // Persistence State
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('jee_core_missions');
    return saved ? JSON.parse(saved) : initialMissions;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('jee_core_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('jee_core_messages');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('jee_core_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Modal / Bottom Sheet States
  const [activeFocusMission, setActiveFocusMission] = useState<Mission | null>(null);
  const [activeDetailMission, setActiveDetailMission] = useState<Mission | null>(null);
  const [isCreateMissionOpen, setIsCreateMissionOpen] = useState<boolean>(false);
  const [isNotificationShadeOpen, setIsNotificationShadeOpen] = useState<boolean>(false);
  const [activeNotificationToast, setActiveNotificationToast] = useState<NotificationItem | null>(null);

  // Chat State
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('jee_core_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('jee_core_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('jee_core_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('jee_core_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle Android Back Gesture / Button
  const handleAndroidBack = () => {
    if (activeFocusMission) {
      setActiveFocusMission(null);
      return;
    }
    if (activeDetailMission) {
      setActiveDetailMission(null);
      return;
    }
    if (isCreateMissionOpen) {
      setIsCreateMissionOpen(false);
      return;
    }
    if (isNotificationShadeOpen) {
      setIsNotificationShadeOpen(false);
      return;
    }
    if (activeTab !== 'coach') {
      setActiveTab('coach');
      return;
    }
  };

  const handleAndroidHome = () => {
    setActiveFocusMission(null);
    setActiveDetailMission(null);
    setIsCreateMissionOpen(false);
    setIsNotificationShadeOpen(false);
    setActiveTab('coach');
  };

  // Active mission resolution
  const currentActiveMission = missions.find((m) => m.status === 'active') || missions[0];

  // Send message to Gemini Coach Server Route
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setChatLoading(true);
    setChatError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          currentMission: currentActiveMission,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned error');
      }

      const data = await res.json();
      const coachMsg: ChatMessage = {
        id: `msg-coach-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Stay focused! Solve 5 PYQs right now to build momentum.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatError('Could not reach Gemini service. Tap retry to reconnect.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(initialChatMessages);
  };

  // Mission Progress update (e.g. from Focus Timer or question tick)
  const handleUpdateMissionProgress = (missionId: string, questionsAdded: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const newCount = Math.min(m.totalQuestions, m.completedCount + questionsAdded);
          const isDone = newCount >= m.totalQuestions;
          const remainingMins = Math.max(
            0,
            Math.round(m.estimatedMinutes * (1 - newCount / m.totalQuestions))
          );

          if (isDone && m.status !== 'completed') {
            // Trigger Android notification for completion
            const completionNotif: NotificationItem = {
              id: `notif-${Date.now()}`,
              title: 'JEE CORE',
              subText: 'Mission Accomplished',
              message: `🎉 "${m.title}" completed! High-yield mastery recorded.`,
              missionId: m.id,
              actionLabel: 'VIEW HISTORY',
              timestamp: Date.now(),
              read: false,
            };
            setNotifications((n) => [completionNotif, ...n]);
            setActiveNotificationToast(completionNotif);
          }

          return {
            ...m,
            completedCount: newCount,
            remainingMinutes: remainingMins,
            status: isDone ? 'completed' : m.status,
            completedAt: isDone ? 'Just now' : m.completedAt,
          };
        }
        return m;
      })
    );
  };

  // Question complete toggle
  const handleToggleQuestion = (missionId: string, questionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          let toggledTo = false;
          const updatedQs = m.questions.map((q) => {
            if (q.id === questionId) {
              toggledTo = !q.completed;
              return { ...q, completed: !q.completed };
            }
            return q;
          });
          const delta = toggledTo ? 1 : -1;
          const newCount = Math.max(0, Math.min(m.totalQuestions, m.completedCount + delta));
          return {
            ...m,
            questions: updatedQs,
            completedCount: newCount,
            remainingMinutes: Math.max(
              0,
              Math.round(m.estimatedMinutes * (1 - newCount / m.totalQuestions))
            ),
          };
        }
        return m;
      })
    );
  };

  // Toggle mission complete
  const handleToggleCompleteMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const willComplete = m.status !== 'completed';
          return {
            ...m,
            status: willComplete ? 'completed' : 'active',
            completedCount: willComplete ? m.totalQuestions : 0,
            remainingMinutes: willComplete ? 0 : m.estimatedMinutes,
            completedAt: willComplete ? 'Just now' : undefined,
          };
        }
        return m;
      })
    );
  };

  // Create new mission
  const handleCreateMission = (newMission: Partial<Mission>) => {
    const fullMission: Mission = {
      id: `m-${Date.now()}`,
      title: newMission.title || 'Untitled Mission',
      subject: newMission.subject || 'Physics',
      chapter: newMission.chapter || 'Important Chapter',
      completedCount: 0,
      totalQuestions: newMission.totalQuestions || 15,
      estimatedMinutes: newMission.estimatedMinutes || 45,
      remainingMinutes: newMission.remainingMinutes || 45,
      priority: newMission.priority || 'HIGH',
      status: 'active',
      keyConcepts: newMission.keyConcepts || [],
      actionSteps: newMission.actionSteps || [],
      questions: newMission.questions || [],
      createdAt: 'Just now',
    };

    setMissions((prev) => [fullMission, ...prev]);

    // Show Android reminder notification
    const reminderNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'JEE CORE',
      subText: 'Mission reminder',
      message: `"${fullMission.title}" is waiting for you.`,
      missionId: fullMission.id,
      actionLabel: 'OPEN MISSION',
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [reminderNotif, ...prev]);
    setActiveNotificationToast(reminderNotif);
  };

  // Reset to sample data
  const handleResetData = () => {
    setMissions(initialMissions);
    setUserProfile(initialProfile);
    setNotifications(initialNotifications);
    setMessages(initialChatMessages);
    localStorage.clear();
  };

  // Sample notification trigger for Android notification test
  const handleShowSampleNotification = () => {
    const testNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'JEE CORE',
      subText: 'Mission reminder',
      message: '"Electrostatics PYQs" is waiting for you.',
      missionId: 'm1',
      actionLabel: 'OPEN MISSION',
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [testNotif, ...prev]);
    setActiveNotificationToast(testNotif);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <PhoneShell
      onBack={handleAndroidBack}
      onHome={handleAndroidHome}
      onOpenNotifications={() => setIsNotificationShadeOpen(true)}
      unreadCount={unreadNotificationsCount}
      activeNotificationToast={activeNotificationToast}
      onDismissToast={() => setActiveNotificationToast(null)}
      onOpenMissionFromToast={(missionId) => {
        const target = missions.find((m) => m.id === missionId);
        if (target) {
          setActiveDetailMission(target);
        }
      }}
    >
      {/* Screen Views */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'coach' && (
          <CoachScreen
            missions={missions}
            userProfile={userProfile}
            onNavigate={(tab) => setActiveTab(tab)}
            onStartFocus={(mission) => setActiveFocusMission(mission)}
            onOpenMissionDetail={(mission) => setActiveDetailMission(mission)}
            onOpenNotifications={() => setIsNotificationShadeOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
          />
        )}

        {activeTab === 'chat' && (
          <ChatScreen
            userProfile={userProfile}
            currentMission={currentActiveMission}
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isLoading={chatLoading}
            error={chatError}
            onRetry={() => {
              if (messages.length > 0) {
                const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                if (lastUserMsg) handleSendMessage(lastUserMsg.content);
              }
            }}
          />
        )}

        {activeTab === 'mission' && (
          <MissionScreen
            missions={missions}
            onStartFocus={(mission) => setActiveFocusMission(mission)}
            onOpenMissionDetail={(mission) => setActiveDetailMission(mission)}
            onCreateMissionClick={() => setIsCreateMissionOpen(true)}
            onToggleComplete={handleToggleCompleteMission}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen missions={missions} userProfile={userProfile} />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
            missions={missions}
            onResetData={handleResetData}
            onShowNotificationSample={handleShowSampleNotification}
          />
        )}
      </div>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Focus Timer Bottom Sheet */}
      <BottomSheet
        isOpen={!!activeFocusMission}
        onClose={() => setActiveFocusMission(null)}
        title="Mobile Focus Timer"
        subtitle="Dedicated deep work sprint"
      >
        <FocusTimerSheet
          mission={activeFocusMission}
          onUpdateMissionProgress={handleUpdateMissionProgress}
          onClose={() => setActiveFocusMission(null)}
        />
      </BottomSheet>

      {/* Mission Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!activeDetailMission}
        onClose={() => setActiveDetailMission(null)}
        title="Mission Blueprint"
        subtitle="High-yield questions & key concepts"
      >
        {activeDetailMission && (
          <MissionDetailSheet
            mission={activeDetailMission}
            onStartFocus={(m) => {
              setActiveDetailMission(null);
              setActiveFocusMission(m);
            }}
            onToggleQuestion={handleToggleQuestion}
            onToggleCompleteMission={handleToggleCompleteMission}
            onClose={() => setActiveDetailMission(null)}
          />
        )}
      </BottomSheet>

      {/* Create Mission Bottom Sheet */}
      <BottomSheet
        isOpen={isCreateMissionOpen}
        onClose={() => setIsCreateMissionOpen(false)}
        title="Create Preparation Mission"
        subtitle="Manual blueprint or instant Gemini AI plan"
      >
        <CreateMissionSheet
          onCreateMission={handleCreateMission}
          onClose={() => setIsCreateMissionOpen(false)}
        />
      </BottomSheet>

      {/* Android Notification Shade Drawer */}
      <NotificationShade
        isOpen={isNotificationShadeOpen}
        onClose={() => setIsNotificationShadeOpen(false)}
        notifications={notifications}
        onOpenMission={(missionId) => {
          const target = missions.find((m) => m.id === missionId);
          if (target) {
            setActiveDetailMission(target);
          }
        }}
        onDismiss={(id) => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }}
        onClearAll={() => {
          setNotifications([]);
        }}
      />
    </PhoneShell>
  );
}
