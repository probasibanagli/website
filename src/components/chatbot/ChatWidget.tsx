'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const suggestedPrompts = [
  'Find Bengali PG in Chennai',
  'Nearest hospital with Bengali doctor',
  'How to travel by metro in Chennai',
  'Bengali restaurants near me',
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'Sorry, I could not process that.' }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, service is currently unavailable. Please try again later.' }]);
    }
    setLoading(false);
  };

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border animate-slide-up flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">ProbasiBangali AI</p>
                <p className="text-[10px] text-white/70">Ask in Bengali, Tamil, or English</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-text-muted text-center py-4 flex flex-col items-center gap-2">
                  <Home className="w-10 h-10 text-primary/30 mb-1" />
                  Hi! I can help you find PGs, food, hospitals, and more in Tamil Nadu.
                </p>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl border border-border hover:border-primary hover:bg-primary-light text-text-primary transition-all cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-surface text-text-primary rounded-bl-md'
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB Button */}
      {mounted && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Tamil Word Helper — Ask in Bengali, Tamil, or English"
          title="Tamil Word Helper"
          className={cn(
            'fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-2xl shadow-primary/25 flex items-center justify-center transition-all duration-300 cursor-pointer ring-1 ring-primary/10 hover:ring-primary/20',
            isOpen
              ? 'bg-primary-dark rotate-90 text-white'
              : 'bg-gradient-to-br from-primary via-primary to-accent text-white hover:scale-110'
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <svg viewBox="0 0 64 64" className="w-full h-full p-[2px]">
              <defs>
                <filter id="premium-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000" floodOpacity="0.22" />
                </filter>
                <linearGradient id="bubble-back" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FAFAFA" />
                  <stop offset="100%" stopColor="#E2E2E2" />
                </linearGradient>
                <linearGradient id="bubble-front" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F0F0F0" />
                </linearGradient>
              </defs>
              <g filter="url(#premium-shadow)">
                {/* Back bubble (Tamil) - Tail on right */}
                <g transform="translate(26, 12)">
                  <path d="M8 0h12a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-2l6 6l-10-6h-6a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z" fill="url(#bubble-back)" />
                  <text x="14" y="15" textAnchor="middle" dominantBaseline="middle" fill="#C04820" fontSize="15" fontWeight="900" fontFamily="sans-serif">அ</text>
                </g>

                {/* Front bubble (English) - Tail on left */}
                <g transform="translate(10, 18)">
                  <path d="M8 0h12a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-6l-10 6l6-6h-2a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z" fill="url(#bubble-front)" />
                  <text x="14" y="15" textAnchor="middle" dominantBaseline="middle" fill="#D85A30" fontSize="17" fontWeight="900" fontFamily="sans-serif">A</text>
                </g>
              </g>
            </svg>
          )}
        </button>
      )}
    </>
  );
}

