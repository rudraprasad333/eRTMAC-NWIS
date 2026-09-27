import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, FileText, CheckCircle2, CornerDownRight } from 'lucide-react';
import { AssistantQueryResponse } from '../../types';
import { api } from '../../services/api';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  responseObj?: AssistantQueryResponse;
  timestamp: string;
}

const SUGGESTED_QUERIES = [
  "What happened in nearby wells between 2700 and 2800 meters?",
  "Why is stuck pipe risk so high at 2715m depth?",
  "What mud weight and LCM pills did OIL-W087 use?",
  "Show recommended mitigation checklist before drilling ahead."
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello, Engineer. I am your Nearby Wells AI Assistant. I have indexed offset drilling reports, mud logs, and incident investigations for 30 wells across Barmer Basin Block-A. How can I assist with Well OIL-W102's current interval (2,715 m)?",
      timestamp: "10:00 UTC"
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.queryAssistant(textToSend, "OIL-W102", 2715.0);
      const botMsg: Message = {
        sender: 'assistant',
        text: res.answer,
        responseObj: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="petrol-card p-5 flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-brand-cyan">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>"ASK THE WELLS" — RAG KNOWLEDGE ASSISTANT</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-brand-cyan border border-cyan-500/30">
                AI RETRIEVAL ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Semantic natural-language query engine grounded in 30 historical offset well reports
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 flex flex-wrap gap-2 border-b border-[#1C2A3A]/60">
        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 self-center">
          <Sparkles className="w-3 h-3 text-brand-cyan" /> Suggested:
        </span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#101C2C] hover:bg-[#16253B] text-slate-300 hover:text-brand-cyan border border-[#1C2A3A] transition-colors text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-cyan shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`max-w-[80%] rounded-lg p-3.5 text-xs font-sans leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-brand-blue/20 text-slate-100 border border-brand-blue/40'
                : 'bg-[#0A121D] text-slate-200 border border-[#1C2A3A]'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>{msg.sender === 'user' ? 'Drilling Engineer' : 'eRTMAC-NWIS Knowledge Agent'}</span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Citations and Evidence if available */}
              {msg.responseObj && (
                <div className="mt-3 pt-3 border-t border-[#1C2A3A] space-y-2 font-mono">
                  {msg.responseObj.evidence && msg.responseObj.evidence.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">
                        GROUNDED INCIDENT EVIDENCE:
                      </span>
                      <div className="space-y-1.5">
                        {msg.responseObj.evidence.map((ev, eIdx) => (
                          <div key={eIdx} className="bg-[#121B28] p-2 rounded border border-[#1C2A3A] text-[11px] text-slate-300">
                            <span className="text-brand-sky font-bold">[{ev.well_id} @ {ev.depth}m]</span>: {ev.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.responseObj.source_documents && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-slate-400">
                      <span>Source Docs:</span>
                      {msg.responseObj.source_documents.map((doc, dIdx) => (
                        <span key={dIdx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 text-brand-cyan" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 p-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            <span>Synthesizing offset well records & geomechanical model...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="pt-3 border-t border-[#1C2A3A]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about historical drilling problems, mud properties, or mitigation..."
            className="flex-1 bg-[#0A121D] border border-[#1C2A3A] focus:border-brand-cyan rounded-md px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded bg-brand-blue hover:bg-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Query</span>
          </button>
        </form>
      </div>
    </div>
  );
};
