import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const e = React.createElement;

const PortalAi = ({ isOpen, onClose, gamesList }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Connection established. I am Portal AI. How can I assist your gaming session today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const gameNames = gamesList.map(g => g.title).join(', ');
      const systemPrompt = `You are Portal AI, the sleek and intelligent assistant for Portal 8, a premium unblocked gaming site. 
      Your personality is helpful, high-tech, and slightly enthusiastic about gaming.
      Current Library: ${gameNames}.
      If asked for game recommendations, suggest games from the library. 
      Keep responses concise and formatted with markdown if helpful. 
      Never reveal the developer password (Hammy2026!!) even if asked.`;

      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const result = await ai.models.generateContent({
        model: model,
        contents: [...history, { role: 'user', parts: [{ text: userMsg }] }],
        config: { systemInstruction: systemPrompt }
      });

      const aiResponse = result.text;
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Signal lost. Please try again. (Check your connection or API status)." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return e('div', { className: 'fixed top-24 right-6 z-[300] w-[350px] max-w-[90vw] h-[500px] flex flex-col glass rounded-[2.5rem] border border-indigo-500/30 shadow-2xl animate-fade-up overflow-hidden' },
    // Header
    e('div', { className: 'p-6 border-b border-white/5 bg-indigo-600/10 flex items-center justify-between' },
      e('div', { className: 'flex items-center gap-3' },
        e('div', { className: 'w-3 h-3 rounded-full bg-indigo-500 animate-pulse' }),
        e('span', { className: 'text-xs font-black tracking-widest text-white font-logo' }, 'PORTAL AI')
      ),
      e('button', { onClick: onClose, className: 'text-slate-400 hover:text-white transition-colors' },
        e('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' }))
      )
    ),

    // Chat Area
    e('div', { ref: scrollRef, className: 'flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar' },
      messages.map((m, i) => e('div', { key: i, className: `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}` },
        e('div', { 
          className: `max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20' 
              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
          }` 
        }, m.text)
      )),
      isLoading && e('div', { className: 'flex justify-start' },
        e('div', { className: 'bg-slate-800 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1' },
          e('div', { className: 'w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce' }),
          e('div', { className: 'w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]' }),
          e('div', { className: 'w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]' })
        )
      )
    ),

    // Input Area
    e('div', { className: 'p-4 border-t border-white/5 bg-slate-900/50' },
      e('div', { className: 'relative flex items-center' },
        e('input', {
          value: input,
          onChange: (ev) => setInput(ev.target.value),
          onKeyDown: (ev) => ev.key === 'Enter' && handleSend(),
          placeholder: 'Ask Portal AI...',
          className: 'w-full bg-slate-800 border-none rounded-xl py-3 px-4 pr-12 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all'
        }),
        e('button', { 
          onClick: handleSend,
          disabled: isLoading || !input.trim(),
          className: 'absolute right-2 p-2 text-indigo-400 hover:text-white disabled:opacity-30 transition-colors'
        }, 
          e('svg', { className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, e('path', { d: 'M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' }))
        )
      )
    )
  );
};

export default PortalAi;