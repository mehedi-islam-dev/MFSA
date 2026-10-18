"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Cpu,
  TerminalSquare,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Trash2,
  AlertCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

// Global types for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  var SpeechRecognition: any;
  var webkitSpeechRecognition: any;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    content:
      "Marine Analytica Core — online. I'm Jervis, your intelligent research companion. How can I help you today?",
  },
];

export default function MarineAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auto-scroll on new messages ──────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // ── Focus input when panel opens ─────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // ── Text-to-Speech ───────────────────────────────────────────────────────
  const speakText = useCallback(
    (text: string) => {
      if (!isVoiceEnabled || typeof window === "undefined" || !window.speechSynthesis)
        return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang === "en-GB" || v.name.includes("UK English")
      );
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    },
    [isVoiceEnabled]
  );

  // ── Send Message Core Logic ──────────────────────────────────────────────
  const sendPrompt = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      // Instantly render user message
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data) {
          const err =
            data?.error || `Server responded with status: ${response.status}`;
          setErrorMsg(err);
          toast.error(`Jervis: ${err}`);

          // Also surface the error inside the chat history
          const errorMsgObj: ChatMessage = {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: `⚠ **Error:** ${err}`,
          };
          setMessages((prev) => [...prev, errorMsgObj]);
          return;
        }

        const replyContent =
          data.reply ||
          data.content ||
          "Transmission received, standing by.";

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: replyContent,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        speakText(replyContent);
      } catch (err: any) {
        const errMessage =
          err?.message || "Failed to reach Marine Analytica Core. Check connection.";
        setErrorMsg(errMessage);
        toast.error(`Jervis Connection Error: ${errMessage}`);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: `⚠ **Connection Error:** ${errMessage}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, speakText]
  );

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      sendPrompt(input);
    }
  };

  // ── Speech Recognition setup ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        sendPrompt(transcript);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [sendPrompt]);

  // ── Global custom event listener (from other modules) ────────────────────
  useEffect(() => {
    const handleVoiceCommand = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      if (!text) return;
      setIsOpen(true);
      sendPrompt(text);
    };
    window.addEventListener("jarvisVoiceCommand", handleVoiceCommand);
    return () =>
      window.removeEventListener("jarvisVoiceCommand", handleVoiceCommand);
  }, [sendPrompt]);

  // ── Mic Toggle ───────────────────────────────────────────────────────────
  const toggleListening = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      toast.error("Voice recognition is not supported in this browser. Use Chrome or Edge.");
      return;
    }
    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition error:", e);
      }
    }
  };

  // ── Clear chat ───────────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: "assistant",
        content: "Terminal buffer cleared. Standing by.",
      },
    ]);
    setErrorMsg(null);
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="mb-4 w-[340px] md:w-[440px] bg-[rgba(2,12,27,0.85)] backdrop-blur-3xl border border-cyan-400/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] rounded-2xl overflow-hidden flex flex-col"
            style={{ height: "min(580px, calc(100vh - 120px))" }}
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="bg-cyan-950/70 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,1)]" />
                </div>
                <div>
                  <h3 className="text-cyan-100 font-bold tracking-widest text-xs uppercase leading-none">
                    Jervis
                  </h3>
                  <p className="text-[9px] text-cyan-500/80 uppercase tracking-[0.15em] leading-none mt-0.5">
                    Marine Analytica Core — Gemini Flash
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  type="button"
                  className="p-1.5 rounded-lg text-cyan-600 hover:text-cyan-300 hover:bg-cyan-800/30 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  title={isVoiceEnabled ? "Mute Jervis" : "Unmute Jervis"}
                  type="button"
                  className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                    isVoiceEnabled
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                      : "border-transparent text-cyan-600 hover:text-cyan-300"
                  }`}
                >
                  {isVoiceEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="p-1.5 rounded-lg text-cyan-600 hover:text-cyan-300 hover:bg-cyan-800/30 transition-all ml-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Message Thread ───────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar — Jervis */}
                  {msg.role === "assistant" && (
                    <div className="shrink-0 w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.3)] mt-0.5">
                      <TerminalSquare className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 rounded-tr-sm"
                        : "bg-[rgba(6,182,212,0.07)] text-cyan-200 border border-cyan-500/20 rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:text-cyan-300 prose-strong:text-cyan-200 prose-code:text-cyan-300 prose-code:bg-cyan-950/50 prose-code:px-1 prose-code:rounded font-mono text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span className="font-mono text-xs break-words">{msg.content}</span>
                    )}
                  </div>

                  {/* Avatar — User */}
                  {msg.role === "user" && (
                    <div className="shrink-0 w-7 h-7 rounded-full bg-slate-700 border border-slate-600/50 flex items-center justify-center text-[10px] font-bold text-slate-300 mt-0.5">
                      U
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming/Loading indicator */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                    <TerminalSquare className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="bg-[rgba(6,182,212,0.07)] border border-cyan-500/20 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {/* Error state alert box */}
              {errorMsg && (
                <div className="flex items-start gap-2 text-center text-[10px] text-red-300 bg-red-950/50 border border-red-500/40 rounded-lg p-2.5 font-mono shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-left">{errorMsg}</div>
                </div>
              )}
            </div>

            {/* ── Input Bar ────────────────────────────────────────────── */}
            <div className="p-3 bg-cyan-950/50 border-t border-cyan-500/20 shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask Jervis anything…"
                    disabled={isLoading}
                    id="jervis-chat-input"
                    className="w-full bg-[rgba(2,12,27,0.6)] border border-cyan-500/30 rounded-xl py-2.5 pl-4 pr-10 text-cyan-100 font-mono text-xs placeholder:text-cyan-700 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    onClick={handleSendMessage}
                    disabled={isLoading || !hasInput}
                    aria-label="Send message to Jervis"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${
                      hasInput && !isLoading
                        ? "text-cyan-400 hover:text-cyan-200 cursor-pointer hover:scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        : "text-cyan-700/50 cursor-not-allowed opacity-40"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleListening}
                  title="Voice Input"
                  className={`p-2.5 rounded-xl border transition-all duration-300 shrink-0 cursor-pointer ${
                    isListening
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse"
                      : "bg-[rgba(2,12,27,0.6)] border-cyan-500/30 text-cyan-600 hover:text-cyan-300 hover:border-cyan-400"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </form>

              <p className="text-[9px] text-cyan-700/60 text-center mt-2 font-mono tracking-widest uppercase">
                POWERED BY GOOGLE GEMINI · MARINE ANALYTICA
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Toggle Button ─────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        id="jervis-agent-toggle"
        aria-label="Toggle Jervis AI Assistant"
        className="w-14 h-14 bg-cyan-950/90 backdrop-blur-xl border border-cyan-400/60 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_rgba(34,211,238,0.9)] transition-shadow duration-300 group z-50 relative cursor-pointer"
      >
        <div className="absolute inset-0 rounded-full pointer-events-none">
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping opacity-60" />
        </div>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-cyan-300 relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
