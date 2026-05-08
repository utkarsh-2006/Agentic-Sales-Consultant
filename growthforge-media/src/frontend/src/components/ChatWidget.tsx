import { useEffect, useRef, useState } from "react";
import {
  captureLead,
  getSessionId,
  sendChatMessage,
  type ChatResponse,
} from "../api";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface ChatLeadDetails {
  name: string;
  email: string;
}

type CaptureCard = "none" | "name" | "email";

const CHAT_DETAILS_STORAGE_KEY = "growthforge_chat_details";
const CHAT_CAPTURE_STATUS_KEY = "growthforge_capture_status";

const initialLeadDetails: ChatLeadDetails = {
  name: "",
  email: "",
};

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm Chanakya. Ask me about pricing, services, case studies, or whether GrowthForge is a fit for your business.",
};

function createMessageId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatPersonName(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function firstName(value: string): string {
  return value.trim().split(/\s+/)[0] || value;
}

function persistLeadDetails(details: ChatLeadDetails) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHAT_DETAILS_STORAGE_KEY, JSON.stringify(details));
}

function persistCaptureStatus(value: "pending" | "dismissed" | "complete") {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHAT_CAPTURE_STATUS_KEY, value);
}

function shouldStartLeadCapture(data: ChatResponse): boolean {
  const highIntentIntents = new Set(["PRICING", "ROI", "CASE", "ONBOARDING"]);
  return (
    data.message_count >= 2 ||
    data.stage === "DECISION" ||
    data.lead_score >= 5 ||
    data.show_calendly ||
    highIntentIntents.has(data.intent)
  );
}

function buildEmailPrompt(data: ChatResponse, name?: string): string {
  const opener = name ? `Thanks, ${name}. ` : "";

  if (data.intent === "PRICING") {
    return `${opener}I can send the pricing breakdown and next-step options. What's the best email for that? You can type 'skip' if you'd rather not share it.`;
  }

  if (data.intent === "CASE" || data.intent === "ROI") {
    return `${opener}I can send proof points and relevant case studies. What's the best email for that? You can type 'skip' if you'd rather not share it.`;
  }

  if (data.intent === "ONBOARDING" || data.show_calendly) {
    return `${opener}I can send the booking link and follow-up details. What's the best email to use? You can type 'skip' if you'd rather not share it.`;
  }

  return `${opener}What's the best email to send follow-up notes or next steps? You can type 'skip' if you'd rather not share it.`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendlyLink, setCalendlyLink] = useState<string | null>(null);
  const [leadDetails, setLeadDetails] = useState<ChatLeadDetails>(initialLeadDetails);
  const [captureCard, setCaptureCard] = useState<CaptureCard>("none");
  const [capturePrompt, setCapturePrompt] = useState("");
  const [captureValue, setCaptureValue] = useState("");
  const [isSavingCapture, setIsSavingCapture] = useState(false);
  const [captureSuccessMessage, setCaptureSuccessMessage] = useState<string | null>(null);
  const [hasPromptedForLead, setHasPromptedForLead] = useState(false);
  const [emailCaptureReady, setEmailCaptureReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLeadDetails = window.localStorage.getItem(CHAT_DETAILS_STORAGE_KEY);
    const captureStatus = window.localStorage.getItem(CHAT_CAPTURE_STATUS_KEY);

    if (captureStatus === "dismissed" || captureStatus === "complete") {
      setHasPromptedForLead(true);
    }

    if (!storedLeadDetails) {
      return;
    }

    try {
      const parsedLeadDetails = JSON.parse(storedLeadDetails) as Partial<ChatLeadDetails>;
      const hydratedLeadDetails = {
        name: parsedLeadDetails.name ?? "",
        email: parsedLeadDetails.email ?? "",
      };

      setLeadDetails(hydratedLeadDetails);

      if (hydratedLeadDetails.name && hydratedLeadDetails.email) {
        setHasPromptedForLead(true);
        persistCaptureStatus("complete");
      }
    } catch {
      window.localStorage.removeItem(CHAT_DETAILS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, captureCard, calendlyLink, isSavingCapture]);

  const appendAssistantMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId("assistant"),
        role: "assistant",
        content,
      },
    ]);
  };

  const openCaptureCard = (type: CaptureCard, prompt: string) => {
    setCapturePrompt(prompt);
    setCaptureValue("");
    setCaptureSuccessMessage(null);
    setCaptureCard(type);
    setError(null);
  };

  const requestLeadDetailsIfNeeded = (data: ChatResponse) => {
    if (hasPromptedForLead && !emailCaptureReady) {
      return;
    }

    if (!shouldStartLeadCapture(data)) {
      return;
    }

    if (!leadDetails.name) {
      openCaptureCard("name", "Before we go deeper, what should I call you?");
      setHasPromptedForLead(true);
      persistCaptureStatus("pending");
      return;
    }

    if (!leadDetails.email && emailCaptureReady) {
      openCaptureCard("email", buildEmailPrompt(data, leadDetails.name));
      setEmailCaptureReady(false);
      setHasPromptedForLead(true);
      persistCaptureStatus("pending");
    }
  };

  const handleSkipCapture = () => {
    setCaptureCard("none");
    setCaptureValue("");
    setCaptureSuccessMessage(null);
    setEmailCaptureReady(false);
    persistCaptureStatus("dismissed");
  };

  const saveName = () => {
    const trimmedValue = captureValue.trim();
    if (trimmedValue.length < 2 || trimmedValue.includes("@")) {
      setError("Please enter your name here.");
      return;
    }

    const normalizedName = formatPersonName(trimmedValue);

    const nextLeadDetails = {
      ...leadDetails,
      name: normalizedName,
    };

    setLeadDetails(nextLeadDetails);
    persistLeadDetails(nextLeadDetails);
    setCaptureValue("");
    setCaptureSuccessMessage("Saved. Keep going.");
    setEmailCaptureReady(true);
    setError(null);
  };

  const saveEmail = async () => {
    const trimmedValue = captureValue.trim();
    if (!isValidEmail(trimmedValue)) {
      setError("Please enter a valid email.");
      return;
    }

    const nextLeadDetails = {
      ...leadDetails,
      email: trimmedValue,
    };

    setIsSavingCapture(true);
    setError(null);

    try {
      await captureLead({
        session_id: getSessionId(),
        name: nextLeadDetails.name || "Website Visitor",
        email: nextLeadDetails.email,
      });

      setLeadDetails(nextLeadDetails);
      persistLeadDetails(nextLeadDetails);
      persistCaptureStatus("complete");
      setCaptureValue("");
      setCaptureSuccessMessage("Saved. I have it.");
      setEmailCaptureReady(false);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Unable to save your details right now.",
      );
    } finally {
      setIsSavingCapture(false);
    }
  };

  const handleCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (captureCard === "name") {
      saveName();
      return;
    }

    if (captureCard === "email") {
      await saveEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);

    setCalendlyLink(null);
    setIsSending(true);

    try {
      const data = await sendChatMessage({
        session_id: getSessionId(),
        message: trimmedInput,
        name: leadDetails.name || undefined,
        email: leadDetails.email || undefined,
      });

      appendAssistantMessage(data.response);
      setCalendlyLink(data.show_calendly ? data.calendly_link : null);
      requestLeadDetailsIfNeeded(data);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while sending your message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <div className="gradient-brand px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  AI Sales Agent
                </div>
                <h3 className="mt-1 text-lg font-semibold">Chat with Chanakya</h3>
                <p className="mt-1 text-sm text-white/85">
                  Ask your question first. I will only ask for details when they are useful.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
                aria-label="Close chat"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(leadDetails.name || leadDetails.email) && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/90">
                {leadDetails.name && (
                  <span className="rounded-full bg-white/16 px-3 py-1.5 font-medium">
                    {leadDetails.name}
                  </span>
                )}
                {leadDetails.email && (
                  <span className="rounded-full bg-white/16 px-3 py-1.5 font-medium">
                    {leadDetails.email}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="max-h-[26rem] space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {captureCard !== "none" && (
              <div className="rounded-2xl border border-indigo-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{capturePrompt}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {captureCard === "name"
                    ? "This stays separate from the main conversation."
                    : "I only use this to send the useful follow-up."}
                </p>

                {captureSuccessMessage && (
                  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {captureSuccessMessage}
                  </div>
                )}

                <form onSubmit={handleCaptureSubmit} className="mt-4 space-y-3">
                  <input
                    type={captureCard === "email" ? "email" : "text"}
                    value={captureValue}
                    onChange={(e) => setCaptureValue(e.target.value)}
                    placeholder={captureCard === "email" ? "joshua@example.com" : "Joshua"}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSavingCapture || captureValue.trim() === "" || captureSuccessMessage !== null}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl px-4 py-3 font-semibold text-white gradient-brand transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingCapture ? "Saving..." : captureCard === "email" ? "Save email" : "Save name"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (captureSuccessMessage) {
                          setCaptureCard("none");
                          setCaptureSuccessMessage(null);
                          return;
                        }
                        handleSkipCapture();
                      }}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      {captureSuccessMessage ? "Continue" : "Skip"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  Chanakya is thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {calendlyLink && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                <p className="font-medium">Ready to book?</p>
                <a
                  href={calendlyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-100"
                >
                  Book your strategy call
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
            <label htmlFor="chat-message" className="sr-only">
              Ask Chanakya a question
            </label>
            <div className="flex items-end gap-3">
              <textarea
                id="chat-message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, lead quality, onboarding..."
                rows={2}
                className="min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={isSending || input.trim() === ""}
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl px-4 font-semibold text-white gradient-brand transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-3 rounded-full gradient-brand px-5 py-4 text-white shadow-[0_18px_50px_rgba(29,78,216,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h8M8 14h5m-7 6l2.4-2.4a2 2 0 011.4-.6H19a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h1v3z"
              />
            </svg>
          </span>
          <span className="text-left">
            <span className="block text-xs uppercase tracking-[0.18em] text-white/75">
              Live Help
            </span>
            <span className="block text-sm font-semibold">Chat with Chanakya</span>
          </span>
        </button>
      )}
    </div>
  );
}
