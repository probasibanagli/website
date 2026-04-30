'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
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
                <p className="text-sm text-text-muted text-center py-4">
                  👋 Hi! I can help you find PGs, food, hospitals, and more in Tamil Nadu.
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
          className={cn(
            'fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer',
            isOpen ? 'bg-gray-700 rotate-90' : 'bg-primary animate-pulse-glow hover:scale-110'
          )}
          title="Ask in Bengali, Tamil, or English"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </button>
      )}
    </>
  );
}
