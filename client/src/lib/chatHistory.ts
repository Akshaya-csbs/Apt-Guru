import { Message } from "../components/chat/ChatArea";

export type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};

const STORAGE_KEY = "aptguru_chat_history";
const MAX_SESSIONS = 30;

export function getAllSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatSession[];
  } catch {
    return [];
  }
}

export function getSession(id: string): ChatSession | null {
  return getAllSessions().find(s => s.id === id) ?? null;
}

export function saveSession(session: ChatSession): void {
  try {
    const sessions = getAllSessions().filter(s => s.id !== session.id);
    // newest first, cap at MAX_SESSIONS
    const updated = [session, ...sessions].slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    console.warn("Could not save chat history");
  }
}

export function createSession(): ChatSession {
  return {
    id: `chat_${Date.now()}`,
    title: "New Chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
}

export function deleteSession(id: string): void {
  const sessions = getAllSessions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function deriveTitle(firstUserMessage: string): string {
  const trimmed = firstUserMessage.trim();
  return trimmed.length > 45 ? trimmed.slice(0, 42) + "…" : trimmed || "New Chat";
}
