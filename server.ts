import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google Gen AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'JEE CORE',
    version: '2.4.0',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userProfile, currentMission } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are JEE CORE Coach, an elite, highly empathetic yet rigorous mentor for IIT-JEE (Mains & Advanced) aspirants.
User Profile:
- Target: ${userProfile?.targetExam || 'JEE Advanced 2026/2027'}
- Target Percentile/Rank: ${userProfile?.targetRank || 'Top 1000 / 99.8%ile'}
- Current Priority / Focus: ${currentMission ? currentMission.title + ' (' + currentMission.subject + ')' : 'Daily Practice & Revision'}
- Persona Mode: ${userProfile?.mentorTone || 'Analytical & Encouraging'}

Guidelines for response:
1. Phone-First Readability: Keep paragraphs punchy and easy to scan on a 380dp mobile screen. Use bold highlights, short bullet points, and numbered steps.
2. Academic Precision: When explaining physics formulas, reaction mechanisms, or calculus tricks, format them clearly (e.g. $F = q(E + v \\times B)$, $\\int x e^x dx$).
3. Problem Solving Method: If a student asks a doubt, provide:
   - Core Concept / Governing Principle
   - Step-by-Step Attack Plan
   - Shortcut / JEE Trap Warning
   - Quick test-of-understanding question.
4. Keep motivation disciplined and actionable: "Action cures anxiety. Solve 5 PYQs right now."`;

    if (!ai) {
      // Fallback realistic response if API key is not yet set
      const lastMsg = messages?.[messages.length - 1]?.content || '';
      return res.json({
        reply: `### 🎯 JEE Coach Analysis\n\nI hear you loud and clear on: *"${lastMsg.slice(0, 80)}"*.\n\n**Immediate Game Plan for Today:**\n1. **Concept Lock:** Review the core definitions and boundary conditions.\n2. **Targeted PYQ Sprint:** Do 10 PYQs (2020–2024) under a 25-minute timer without looking at hints.\n3. **Trap Detection:** Note down why incorrect options were tempting.\n\n*(Gemini API Key active in environment or simulated. Keep pushing forward!)*`,
        model: 'simulated-jee-coach',
      });
    }

    // Format chat history for Gemini API
    const contents = [];
    if (Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Hello coach, give me my focus for today.' }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.65,
        maxOutputTokens: 1000,
      },
    });

    const reply = response.text || 'Keep grinding! Focus on mastering high-weightage topics today.';
    return res.json({ reply, model: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to communicate with AI Coach',
      reply: '⚠️ Coach connection blip. Review your formula sheet for 5 minutes and retry!',
    });
  }
});

// AI Mission Generator endpoint
app.post('/api/generate-mission', async (req, res) => {
  try {
    const { subject, topic, difficulty, availableMinutes } = req.body;
    const ai = getAIClient();

    const prompt = `Generate a structured, high-yield JEE preparation mission.
Subject: ${subject || 'Physics'}
Topic: ${topic || 'Current Electricity'}
Difficulty: ${difficulty || 'Medium'}
Available Time: ${availableMinutes || 45} minutes

Respond in strict JSON with:
{
  "title": "Concise mission title (e.g. Kirchhoff Laws & Nodal Analysis PYQs)",
  "subject": "${subject || 'Physics'}",
  "chapter": "${topic || 'General'}",
  "questionCount": 15,
  "estimatedMinutes": ${availableMinutes || 45},
  "priority": "HIGH",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
  "pyqYears": "2021-2024 Mains & Adv",
  "actionSteps": ["Step 1", "Step 2", "Step 3"]
}`;

    if (!ai) {
      return res.json({
        title: `${topic || 'High-Yield'} PYQ Sprint`,
        subject: subject || 'Physics',
        chapter: topic || 'Important Topics',
        questionCount: 15,
        estimatedMinutes: availableMinutes || 45,
        priority: 'HIGH',
        keyConcepts: ['Standard Formula Application', 'Boundary Conditions', 'Speed Calculations'],
        pyqYears: '2021-2024',
        actionSteps: [
          '5 mins: Formula revision without notes',
          '35 mins: Timed problem sprint (2 mins/question)',
          '5 mins: Error analysis & tag mistakes',
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Generate mission error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate mission',
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JEE CORE] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
