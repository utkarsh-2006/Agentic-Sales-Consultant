const DEFAULT_API_BASE_URL = "http://localhost:10000";
const SESSION_STORAGE_KEY = "growthforge_session_id";

export interface CaptureLeadPayload {
  session_id: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
}

interface CaptureLeadResponse {
  success: boolean;
  message?: string;
}

export interface ChatPayload {
  session_id: string;
  message: string;
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
}

export interface ChatResponse {
  response: string;
  intent: string;
  stage: string;
  message_count: number;
  lead_score: number;
  lead_score_reason?: string;
  next_action?: string;
  show_calendly: boolean;
  calendly_link: string | null;
  session_id: string;
}

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return createSessionId();
  }

  const existingSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existingSessionId) {
    return existingSessionId;
  }

  const newSessionId = createSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  return newSessionId;
}

export function getApiBaseUrl(): string {
  const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  return envApiBaseUrl && envApiBaseUrl.trim() !== ""
    ? envApiBaseUrl
    : DEFAULT_API_BASE_URL;
}

export async function captureLead(payload: CaptureLeadPayload): Promise<CaptureLeadResponse> {
  const response = await fetch(`${getApiBaseUrl()}/capture-lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as CaptureLeadResponse;

  if (!response.ok) {
    throw new Error(data.message || "Unable to submit your request right now.");
  }

  return data;
}

export async function sendChatMessage(payload: ChatPayload): Promise<ChatResponse> {
  const response = await fetch(`${getApiBaseUrl()}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<ChatResponse> & {
    error?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || data.message || "Unable to send your message right now.");
  }

  if (!data.response || !data.session_id) {
    throw new Error("Received an invalid response from the server.");
  }

  return data as ChatResponse;
}
