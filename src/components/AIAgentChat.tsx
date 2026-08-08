import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GradeLevel, Question } from '../types';
import { Bot, Send, User, Sparkles, Copy, Check, Play, Code, HelpCircle } from 'lucide-react';

interface AIAgentChatProps {
  grade: GradeLevel;
  currentCode?: string;
  onRunCodeInSandbox?: (code: string) => void;
  initialQuestionPrompt?: Question | null;
}

export const AIAgentChat: React.FC<AIAgentChatProps> = ({
  grade,
  currentCode,
  onRunCodeInSandbox,
  initialQuestionPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Xin chào bạn! Mình là **PyBuddy** - AI Agent chuyên hỗ trợ lập trình Python cho học sinh THCS (Lớp ${grade}). 

Bạn muốn mình **đặt câu hỏi kiểm tra**, giải thích bài học, hay tìm lỗi sai trong đoạn code Python của bạn? Hãy cứ hỏi mình thoải mái nha! 🚀`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial question prompt if navigated from quiz
  useEffect(() => {
    if (initialQuestionPrompt) {
      const promptText = `PyBuddy ơi, hãy hướng dẫn và giải thích giúp em câu hỏi này với:\n\n**${initialQuestionPrompt.title}**\n${initialQuestionPrompt.description}\n\nGợi ý của bài: ${initialQuestionPrompt.hint}`;
      handleSendMessage(promptText);
    }
  }, [initialQuestionPrompt]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          grade,
          currentCode,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        throw new Error(data.error || 'Lỗi phản hồi từ AI Agent');
      }
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: '⚠️ Ôi, PyBuddy đang gặp chút sự cố kết nối với hệ thống. Bạn vui lòng thử gửi lại câu hỏi nha!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper parser to render Markdown code blocks nicely
  const renderFormattedText = (text: string, msgId: string) => {
    const codeBlockRegex = /```python([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        content: match[1].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'code') {
        const codeBlockId = `${msgId}-${index}`;
        return (
          <div key={index} className="my-3 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden font-mono text-xs text-slate-100 shadow-sm">
            <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-[11px] text-slate-400 font-sans">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Code className="w-3.5 h-3.5" /> Python Code
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(part.content, codeBlockId)}
                  className="hover:text-white flex items-center gap-1 font-semibold"
                >
                  {copiedId === codeBlockId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === codeBlockId ? 'Đã chép' : 'Sao chép'}</span>
                </button>

                {onRunCodeInSandbox && (
                  <button
                    onClick={() => onRunCodeInSandbox(part.content)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Mở trong Sandbox</span>
                  </button>
                )}
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-emerald-300 leading-relaxed font-mono">
              {part.content}
            </pre>
          </div>
        );
      }

      return (
        <p key={index} className="whitespace-pre-wrap leading-relaxed">
          {part.content}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[75vh] overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between border-b border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base flex items-center gap-2">
                <span>PyBuddy - Trợ Lý AI Python</span>
                <span className="text-[10px] bg-emerald-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                  Online
                </span>
              </h2>
              <p className="text-xs text-sky-100">Khối Lớp {grade} • Sẵn sàng đặt câu hỏi & giải đáp</p>
            </div>
          </div>
        </div>

        {/* Quick Prompt Suggestions Chips */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Gợi ý:
          </span>
          {[
            `❓ Hãy đặt cho tôi 1 câu hỏi Python Lớp ${grade}!`,
            '💡 Giải thích câu lệnh if/else bằng ví dụ sinh động',
            '🐞 Hướng dẫn sửa lỗi IndentationError',
            '🎮 Cho em ý tưởng code game đoán số bằng Python',
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(promptText)}
              className="px-3 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-xl shrink-0 transition-all cursor-pointer shadow-2xs"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAgent = msg.sender === 'agent';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isAgent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isAgent ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-sm font-medium shadow-xs ${
                    isAgent
                      ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs'
                  }`}
                >
                  {renderFormattedText(msg.text, msg.id)}
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isAgent ? 'text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>PyBuddy đang soạn câu trả lời...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Đặt câu hỏi hoặc bảo PyBuddy "Đặt câu hỏi cho tôi" (Lớp ${grade})...`}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm font-medium bg-slate-50 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-sm shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
