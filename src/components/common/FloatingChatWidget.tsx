import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { ragService } from '../../services/ragService';
import { ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const FloatingChatWidget: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello ${currentUser ? currentUser.name.split(' ')[0] : 'there'}! I am **SkillBridge AI**, your intelligent career and collaboration copilot.\n\nAsk me anything about internship match scores, skill gap roadmaps, industry masterclasses, or faculty development programs!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What internships match my Python and SQL skills?',
    'How do I close my gap in cloud computing?',
    'What FDPs are open for CS faculty this month?',
    'How does the Cosine Skill Matching algorithm work?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await ragService.answerQuestion(text, currentRole, messages);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        citedSources: response.citedSources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('RAG query failed', error);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, I encountered a temporary connection issue while querying the vector database. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat session refreshed. How can I help you navigate SkillBridge today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-surface shadow-soft-lg border-2 border-[#A45C40]/30 hover:shadow-glow transition-all group"
            >
              <div className="relative">
                <Bot className="w-6 h-6 text-[#FFFDF9]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-success rounded-full border-2 border-primary" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold leading-tight">Ask SkillBridge AI</span>
                <span className="block text-[10px] text-bg/80">RAG Vector Assistant</span>
              </div>
              <Sparkles className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[620px] h-[85vh] rounded-2xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark p-4 text-surface flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface/15 flex items-center justify-center border border-surface/20">
                  <Bot className="w-5 h-5 text-surface" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm text-surface">SkillBridge AI</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent/30 text-surface uppercase tracking-wider">
                      RAG V2
                    </span>
                  </div>
                  <p className="text-[10px] text-surface/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Grounded with Firestore Vector Store
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="p-1.5 rounded-lg text-surface/80 hover:text-surface hover:bg-surface/10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-surface/80 hover:text-surface hover:bg-surface/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Role Context Bar */}
            <div className="bg-bg-alt/80 px-4 py-1.5 border-b border-border text-[11px] text-text flex items-center justify-between">
              <span className="text-text-muted">Active Role Context:</span>
              <span className="font-semibold text-primary uppercase text-[10px] tracking-wider">
                {currentRole} Mode
              </span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg/40">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                        isUser
                          ? 'bg-accent text-surface'
                          : 'bg-primary text-surface shadow-sm'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Content Box */}
                    <div className={`max-w-[82%] space-y-2`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-primary text-surface rounded-tr-none shadow-sm'
                            : 'bg-surface border border-border text-text rounded-tl-none shadow-soft'
                        }`}
                      >
                        <div className="whitespace-pre-line prose-xs">
                          {msg.content}
                        </div>
                      </div>

                      {/* Cited Sources Chips */}
                      {msg.citedSources && msg.citedSources.length > 0 && (
                        <div className="pt-1 space-y-1">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-accent" /> Grounded Sources ({msg.citedSources.length}):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.citedSources.map((source, sIdx) => (
                              <div
                                key={sIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-bg-alt border border-border text-[10px] font-medium text-text hover:border-accent transition-colors"
                              >
                                <span className="px-1 rounded bg-primary/10 text-primary font-bold text-[9px] uppercase">
                                  {source.type}
                                </span>
                                <span className="truncate max-w-[140px]" title={source.title}>
                                  {source.title}
                                </span>
                                {source.score && (
                                  <span className="text-[9px] text-accent font-semibold">
                                    {source.score}%
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className="block text-[9px] text-text-muted text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary text-surface flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-surface border border-border text-xs text-text-muted shadow-soft flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>Searching vector knowledge base & synthesizing grounded response...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips (when few messages) */}
            {messages.length <= 3 && !isLoading && (
              <div className="px-4 py-2 bg-surface border-t border-border/60">
                <p className="text-[10px] font-bold text-text-muted mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-accent" /> Suggested Questions:
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="whitespace-nowrap px-2.5 py-1 rounded-full bg-bg-alt/90 hover:bg-bg-alt text-[11px] text-text border border-border transition-colors text-left flex items-center gap-1"
                    >
                      <span>{q}</span>
                      <ChevronRight className="w-3 h-3 text-accent" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-surface border-t border-border flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about internships, gap analysis, courses..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-bg/50 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-surface shadow-sm transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
