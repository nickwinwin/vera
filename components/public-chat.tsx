'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PublicChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hallo! Ich bin der VERA-Assistent. Wie kann ich Ihnen helfen?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Wie können wir Ihnen helfen? Schreiben Sie uns gern eine E-Mail an kontakt@vera-docs.de.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all z-50 overflow-hidden border-2 border-white"
        >
          <Image src="/img/vera_avatar.png" alt="VERA" fill className="object-cover" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-brand-border flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-brand-dark px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                  <Image src="/img/vera_avatar.png" alt="VERA" width={36} height={36} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">VERA Support</p>
                  <p className="text-brand-muted text-xs">Fragen? Einfach tippen.</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-brand-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-brand-warm-white">
              <div className="bg-brand-beige/10 border border-brand-beige/20 rounded-lg px-4 py-3 mb-2">
                <p className="text-xs text-brand-dark/70 leading-relaxed">
                  💡 Fragen Sie mich: Was kostet VERA? Wie funktioniert die digitale Einwilligung? Wie läuft eine Demo ab?
                </p>
              </div>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-beige text-white rounded-br-none'
                        : 'bg-white text-brand-dark border border-brand-border rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-brand-dark prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-brand-dark prose-code:bg-brand-warm-white prose-code:px-1 prose-code:rounded prose-code:text-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-border rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
                    <Loader2 className="w-5 h-5 text-brand-beige animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-brand-border px-4 py-3 flex-shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  placeholder="Frage zu VERA..."
                  className="flex-1 px-4 py-2.5 bg-brand-warm-white border border-brand-border rounded-lg text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-beige/40 focus:border-brand-beige"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-brand-beige text-white rounded-lg flex items-center justify-center hover:bg-[#B8973B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-brand-muted text-center mt-2">KI-Assistent · Antworten können ungenau sein</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}