import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Hackathon } from '../types';
import { resolveHackZoneQuery, ChatbotResponse } from '../utils/chatbotBrain';
import { getDeadlineStatus, formatDateRange } from '../utils/dateUtils';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ExternalLink,
  Copy,
  Check,
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  matchedHackathons?: Hackathon[];
  suggestedPrompts?: string[];
  source?: 'n8n' | 'hackzone';
}

const N8N_WEBHOOK_URL = 'https://sekhar1906.app.n8n.cloud/webhook/18c7b59f-813b-4947-a44e-3d71d53baba5/chat';

export const Chatbot: React.FC = () => {
  const { hackathons, currentUser, openHackathonDetails } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [n8nStatus, setN8nStatus] = useState<'connected' | 'standby'>('standby');

  // Maintain a persistent sessionId for n8n conversation memory
  const [sessionId] = useState<string>(() => {
    try {
      const stored = sessionStorage.getItem('hackzone_n8n_session');
      if (stored) return stored;
      const newId = `hz_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('hackzone_n8n_session', newId);
      return newId;
    } catch {
      return `hz_session_${Date.now()}`;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem('hackzone_chat_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `👋 Hi ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I'm your **HackZone AI Agent**.\n\nI can help you:\n• 📍 Find hackathons across India (e.g. *Visakhapatnam, Hyderabad, Bengaluru, Delhi*)\n• 🏆 Locate high-prize competitions (₹1 Lakh to ₹5 Lakhs)\n• 💻 Filter by tech stack (*AI/ML, Web3, IoT, Cybersecurity*)\n• ⏰ Check urgent deadlines and registration guides\n\nHow can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: [
          '📍 Hackathons in Visakhapatnam',
          '⚡ Events closing soon',
          '🤖 AI & Machine Learning',
          '🏆 ₹1 Lakh+ prize pool'
        ],
        source: 'hackzone'
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('hackzone_chat_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Listen for global open chat triggers
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-hackzone-chat', handleOpenChat);
    return () => window.removeEventListener('open-hackzone-chat', handleOpenChat);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsgId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    let replied = false;

    // 1. Attempt to communicate with n8n Webhook first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const payload = {
        chatInput: text,
        message: text,
        sessionId: sessionId,
        action: 'sendMessage',
        user: {
          name: currentUser?.name || 'Student Developer',
          role: currentUser?.role || 'STUDENT',
          city: currentUser?.city || 'Visakhapatnam',
          state: currentUser?.state || 'Andhra Pradesh'
        },
        timestamp: new Date().toISOString()
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setN8nStatus('connected');
        const contentType = response.headers.get('content-type') || '';
        let replyText = '';

        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (typeof data === 'string') {
            replyText = data;
          } else if (Array.isArray(data) && data.length > 0) {
            const item = data[0];
            replyText = item?.output || item?.text || item?.message || item?.response || JSON.stringify(item);
          } else if (data && typeof data === 'object') {
            replyText = data.output || data.text || data.message || data.response || data.reply || JSON.stringify(data);
          }
        } else {
          replyText = await response.text();
        }

        if (replyText && replyText.trim() !== '') {
          const botMsg: ChatMessage = {
            id: `msg-${Date.now()}-bot`,
            sender: 'assistant',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'n8n'
          };
          setMessages((prev) => [...prev, botMsg]);
          replied = true;
        }
      } else {
        // n8n returned 404/500 (e.g. workflow in test mode or inactive)
        setN8nStatus('standby');
      }
    } catch {
      setN8nStatus('standby');
    }

    // 2. If n8n was not reachable or workflow is not active, seamlessly resolve via HackZone Intelligent Engine
    if (!replied) {
      // Simulate natural thinking delay
      await new Promise((resolve) => setTimeout(resolve, 350));

      const resolution: ChatbotResponse = resolveHackZoneQuery(
        text,
        hackathons,
        currentUser?.name
      );

      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: 'assistant',
        text: resolution.text,
        matchedHackathons: resolution.matchedHackathons,
        suggestedPrompts: resolution.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'hackzone'
      };

      setMessages((prev) => [...prev, botMsg]);
    }

    if (!isOpen) {
      setHasUnread(true);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const resetMessages: ChatMessage[] = [
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Chat history cleared. How can I help you discover hackathons today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: [
          'Hackathons in Visakhapatnam',
          'AI Hackathons',
          'Closing Soon',
          'Highest Prize Pool'
        ],
        source: 'hackzone'
      }
    ];
    setMessages(resetMessages);
    sessionStorage.removeItem('hackzone_chat_messages');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-3.5 sm:px-5 sm:py-3.5 text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="Open AI Assistant"
          >
            <div className="relative">
              <Bot className="h-6 w-6 text-white group-hover:rotate-6 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>

            <span className="hidden sm:inline font-display text-sm font-bold tracking-wide">
              Chat with AI
            </span>

            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md">
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[440px] h-[620px] max-h-[88vh] flex flex-col rounded-2xl border border-cyan-500/30 bg-slate-950/95 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20">
                <Bot className="h-5 w-5 text-slate-950" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                  HackZone AI Agent
                  <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {n8nStatus === 'connected' ? 'n8n Active Agent' : 'Smart HackZone Engine'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Clear chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group space-y-2`}
                >
                  <div
                    className={`relative max-w-[90%] rounded-2xl p-3.5 shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed break-words">
                      {msg.text}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] opacity-75">
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <div className="flex items-center gap-2">
                          {msg.source && (
                            <span className="text-[9px] uppercase tracking-wider text-cyan-400/80">
                              {msg.source === 'n8n' ? 'n8n Agent' : 'HackZone Agent'}
                            </span>
                          )}
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-cyan-300"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Hackathon Mini Cards */}
                  {!isUser && msg.matchedHackathons && msg.matchedHackathons.length > 0 && (
                    <div className="w-full space-y-2 pt-1 pl-1">
                      {msg.matchedHackathons.map((h) => {
                        const deadlineInfo = getDeadlineStatus(h.registrationDeadline);
                        return (
                          <div
                            key={h.id}
                            className="rounded-xl border border-cyan-500/20 bg-slate-900/90 p-3 hover:border-cyan-500/50 hover:bg-slate-900 transition-all shadow-md group/card"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-white text-xs sm:text-sm line-clamp-1 group-hover/card:text-cyan-300 transition-colors">
                                {h.name}
                              </h4>
                              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                                {h.prizePool}
                              </span>
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-cyan-400" />
                                {h.city}, {h.state}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-blue-400" />
                                {formatDateRange(h.startDate, h.endDate)}
                              </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px]">
                              <span className={`px-1.5 py-0.5 rounded border text-[10px] ${deadlineInfo.badgeClass}`}>
                                {deadlineInfo.label}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => openHackathonDetails(h.id)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-semibold transition-colors flex items-center gap-1"
                                >
                                  View Details
                                </button>
                                {h.registrationUrl && (
                                  <a
                                    href={h.registrationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold transition-colors flex items-center gap-1"
                                  >
                                    Register
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Contextual Suggested Prompt Pills */}
                  {!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                      {msg.suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white transition-all shadow-sm flex items-center gap-1"
                        >
                          <Zap className="h-2.5 w-2.5 text-cyan-400" />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="rounded-2xl rounded-bl-none border border-slate-800 bg-slate-900 p-3.5 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2 text-xs text-slate-400 font-medium">Assistant thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-slate-800 bg-slate-900/90 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Ask anything (e.g. Find AI hacks in Vizag)..."
                className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3 text-cyan-400" />
                n8n webhook integrated
              </span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
