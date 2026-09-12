var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var aiClient = null;
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "JEE CORE",
    version: "2.4.0",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile, currentMission } = req.body;
    const ai = getAIClient();
    const systemPrompt = `You are JEE CORE Coach, an elite, highly empathetic yet rigorous mentor for IIT-JEE (Mains & Advanced) aspirants.
User Profile:
- Target: ${userProfile?.targetExam || "JEE Advanced 2026/2027"}
- Target Percentile/Rank: ${userProfile?.targetRank || "Top 1000 / 99.8%ile"}
- Current Priority / Focus: ${currentMission ? currentMission.title + " (" + currentMission.subject + ")" : "Daily Practice & Revision"}
- Persona Mode: ${userProfile?.mentorTone || "Analytical & Encouraging"}

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
      const lastMsg = messages?.[messages.length - 1]?.content || "";
      return res.json({
        reply: `### \u{1F3AF} JEE Coach Analysis

I hear you loud and clear on: *"${lastMsg.slice(0, 80)}"*.

**Immediate Game Plan for Today:**
1. **Concept Lock:** Review the core definitions and boundary conditions.
2. **Targeted PYQ Sprint:** Do 10 PYQs (2020\u20132024) under a 25-minute timer without looking at hints.
3. **Trap Detection:** Note down why incorrect options were tempting.

*(Gemini API Key active in environment or simulated. Keep pushing forward!)*`,
        model: "simulated-jee-coach"
      });
    }
    const contents = [];
    if (Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Hello coach, give me my focus for today." }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.65,
        maxOutputTokens: 1e3
      }
    });
    const reply = response.text || "Keep grinding! Focus on mastering high-weightage topics today.";
    return res.json({ reply, model: "gemini-3.8-flash" });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to communicate with AI Coach",
      reply: "\u26A0\uFE0F Coach connection blip. Review your formula sheet for 5 minutes and retry!"
    });
  }
});
app.post("/api/generate-mission", async (req, res) => {
  try {
    const { subject, topic, difficulty, availableMinutes } = req.body;
    const ai = getAIClient();
    const prompt = `Generate a structured, high-yield JEE preparation mission.
Subject: ${subject || "Physics"}
Topic: ${topic || "Current Electricity"}
Difficulty: ${difficulty || "Medium"}
Available Time: ${availableMinutes || 45} minutes

Respond in strict JSON with:
{
  "title": "Concise mission title (e.g. Kirchhoff Laws & Nodal Analysis PYQs)",
  "subject": "${subject || "Physics"}",
  "chapter": "${topic || "General"}",
  "questionCount": 15,
  "estimatedMinutes": ${availableMinutes || 45},
  "priority": "HIGH",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
  "pyqYears": "2021-2024 Mains & Adv",
  "actionSteps": ["Step 1", "Step 2", "Step 3"]
}`;
    if (!ai) {
      return res.json({
        title: `${topic || "High-Yield"} PYQ Sprint`,
        subject: subject || "Physics",
        chapter: topic || "Important Topics",
        questionCount: 15,
        estimatedMinutes: availableMinutes || 45,
        priority: "HIGH",
        keyConcepts: ["Standard Formula Application", "Boundary Conditions", "Speed Calculations"],
        pyqYears: "2021-2024",
        actionSteps: [
          "5 mins: Formula revision without notes",
          "35 mins: Timed problem sprint (2 mins/question)",
          "5 mins: Error analysis & tag mistakes"
        ]
      });
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error) {
    console.error("Generate mission error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate mission"
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JEE CORE] Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
