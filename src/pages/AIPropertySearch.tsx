import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin, Bed, Bath, Maximize, ArrowUp, Plus,
  BookOpen, Building2,
  PenLine, Volume2, VolumeX, Mic, Search, TrendingUp, Map as MapIcon, Image as ImageIcon,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import emmaAvatar from '@/assets/emma-ai-assistant.png';
import { buildLangParam, getCurrentLanguage, getTranslatedPropertyPath } from '@/utils/slugHelpers';

interface PropertyLink {
  id: number | string;
  title: string;
  price: string;
  location: string;
  image?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

interface ArticleLink {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  propertyLinks?: PropertyLink[];
  articleLinks?: ArticleLink[];
}

const SUGGESTED_PROMPTS = [
  { icon: Search, text: 'Find my dream apartment in Dubai' },
  { icon: TrendingUp, text: 'Which areas are best to invest in?' },
  { icon: MapIcon, text: 'Plan a viewing trip in Antalya' },
  { icon: ImageIcon, text: 'Show photos of modern luxury villas' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'sv', label: 'Svenska' },
  { code: 'da', label: 'Dansk' },
  { code: 'de', label: 'Deutsch' },
  { code: 'no', label: 'Norsk' },
  { code: 'ru', label: 'Русский' },
  { code: 'ur', label: 'اردو' },
  { code: 'ar', label: 'العربية' },
  { code: 'fa', label: 'فارسی' },
  { code: 'tr', label: 'Türkçe' },
];

type ReadMode = 'write' | 'speak' | 'muted';

const AIPropertySearch = () => {
  const { toast } = useToast();
  const routeLocation = useLocation();
  const lang = getCurrentLanguage(routeLocation.search);
  const propertyPath = getTranslatedPropertyPath(lang);
  const langParam = buildLangParam(lang);

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [readMode, setReadMode] = useState<ReadMode>('write');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (readMode !== 'speak' || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang || 'en';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch {
      /* ignore */
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    const historySnapshot = messages.map(m => ({ sender: m.sender, text: m.text }));
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: trimmed,
          conversationHistory: historySnapshot,
          conversationId,
        },
      });

      if (error) throw error;

      const aiText = data?.response || "Sorry, I couldn't process that. Please try again.";
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
        propertyLinks: data?.propertyLinks ?? [],
        articleLinks: data?.articleLinks ?? [],
      };

      setMessages(prev => [...prev, aiMessage]);
      if (data?.conversationId) setConversationId(data.conversationId);
      speak(aiText);
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: 'Connection Error',
        description: 'Could not reach AI assistant.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleLanguageChange = (code: string) => {
    if (code === 'en') {
      localStorage.removeItem('preferred_language');
    } else {
      localStorage.setItem('preferred_language', code);
    }
    const params = new URLSearchParams(routeLocation.search);
    if (code === 'en') params.delete('lang');
    else params.set('lang', code);
    const search = params.toString();
    window.location.href = `/ai-property-search${search ? `?${search}` : ''}`;
  };

  return (
    <div dir="ltr" className="h-screen flex bg-white text-gray-900 overflow-hidden">
      <SEOHead
        title="AI Property Search | Future Homes International"
        description="Chat with Emma, your personal AI assistant trained on 180+ properties and our complete property guides."
        keywords="AI property search, real estate AI, property assistant, Future Homes, Emma"
        canonicalUrl="https://futurehomesinternational.com/ai-property-search"
      />

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <Link to={`/${langParam}`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-[#0a2540] flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Future Homes AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-xs text-gray-600 bg-transparent border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:border-gray-400"
              aria-label="Language"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <Link to={`/${langParam}`} className="text-xs text-gray-500 hover:text-gray-700 hidden sm:inline">
              futurehomesinternational.com
            </Link>
          </div>
        </header>

        {/* Content area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            // ============ Welcome screen (Emma) ============
            <div className="min-h-full flex flex-col items-center justify-center px-4 py-10 max-w-3xl mx-auto w-full">
              <div className="relative mb-6">
                <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                  <img src={emmaAvatar} alt="Emma — your AI property assistant" className="w-full h-full object-cover" />
                </div>
                <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Find your dream home with Emma
              </h1>

              {/* Mode pills */}
              <div className="flex items-center gap-2 mb-6 flex-wrap justify-center">
                <button
                  onClick={() => setReadMode('write')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    readMode === 'write'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PenLine className="h-4 w-4" /> Write
                </button>
                <button
                  onClick={() => setReadMode('speak')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    readMode === 'speak'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Volume2 className="h-4 w-4" /> Speak
                </button>
                <button
                  onClick={() => setReadMode('muted')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    readMode === 'muted'
                      ? 'bg-gray-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <VolumeX className="h-4 w-4" /> Muted
                </button>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-3">
                <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-3 pr-2 py-2 shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
                  <button type="button" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Plus className="h-5 w-5" />
                  </button>
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    rows={1}
                    className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-gray-900 placeholder:text-gray-400 text-sm leading-6 py-1"
                    style={{ minHeight: '24px' }}
                    disabled={isLoading}
                  />
                  <button type="button" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mic className="h-4 w-4" />
                  </button>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim() || isLoading}
                    className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 flex-shrink-0"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Suggested actions */}
              <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt.text)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                      i < SUGGESTED_PROMPTS.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <prompt.icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-6 text-center">
                Emma can make mistakes. Verify important details with our team.
              </p>
            </div>
          ) : (
            // ============ Chat thread ============
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {isUser ? (
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">You</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-white shadow-md">
                          <AvatarImage src={emmaAvatar} alt="Emma" className="object-cover" />
                          <AvatarFallback className="bg-blue-600 text-white text-sm">E</AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`flex-1 min-w-0 space-y-3 ${isUser ? 'flex flex-col items-end' : ''}`}>
                        <div className={`max-w-[85%] ${isUser ? 'text-right' : ''}`}>
                          <div className={`text-sm font-semibold text-gray-900 mb-1 ${isUser ? 'text-right' : ''}`}>
                            {isUser ? 'You' : 'Emma'}
                          </div>
                          {isUser ? (
                            <div className="inline-block bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm whitespace-pre-wrap text-left">
                              {msg.text}
                            </div>
                          ) : (
                            <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:my-0 prose-a:text-blue-600 text-gray-700">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>

                        {!isUser && msg.propertyLinks && msg.propertyLinks.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 w-full">
                            {msg.propertyLinks.map((p) => (
                              <Link key={p.id} to={`/${propertyPath}/${p.id}${langParam}`}>
                                <Card className="overflow-hidden bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
                                  {p.image && (
                                    <div className="aspect-video overflow-hidden bg-gray-100">
                                      <img
                                        src={p.image}
                                        alt={p.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                  <CardContent className="p-3">
                                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">{p.title}</h4>
                                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate">{p.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                      {p.bedrooms != null && (
                                        <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{p.bedrooms}</span>
                                      )}
                                      {p.bathrooms != null && (
                                        <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{p.bathrooms}</span>
                                      )}
                                      {p.area != null && (
                                        <span className="flex items-center gap-1"><Maximize className="h-3 w-3" />{p.area}m²</span>
                                      )}
                                    </div>
                                    <div className="text-sm font-bold text-blue-600">{p.price}</div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        )}

                        {!isUser && msg.articleLinks && msg.articleLinks.length > 0 && (
                          <div className="space-y-2 pt-2 w-full">
                            <p className="text-xs uppercase tracking-wide text-gray-400 font-medium flex items-center gap-1.5">
                              <BookOpen className="h-3 w-3" />
                              Related guides
                            </p>
                            {msg.articleLinks.map((a) => (
                              <Link key={a.id} to={`/article/${a.slug}${langParam}`}>
                                <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                                  <CardContent className="p-3 flex gap-3 items-center">
                                    {a.image && (
                                      <img src={a.image} alt={a.title} className="h-14 w-14 object-cover rounded-md flex-shrink-0" loading="lazy" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-sm font-medium text-gray-900 line-clamp-1">{a.title}</h5>
                                      {a.excerpt && (
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{a.excerpt}</p>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-white shadow-md">
                    <AvatarImage src={emmaAvatar} alt="Emma" className="object-cover" />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">E</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1.5 pt-3">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Bottom input — only shown when there are messages */}
        {messages.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <button
                  onClick={() => setReadMode('write')}
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    readMode === 'write' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <PenLine className="h-3 w-3" /> Write
                </button>
                <button
                  onClick={() => setReadMode('speak')}
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    readMode === 'speak' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Volume2 className="h-3 w-3" /> Speak
                </button>
                <button
                  onClick={() => setReadMode('muted')}
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    readMode === 'muted' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <VolumeX className="h-3 w-3" /> Read out: {readMode === 'muted' ? 'Off' : 'On'}
                </button>
              </div>
              <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-3 pr-2 py-2 shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
                <button type="button" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-5 w-5" />
                </button>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  rows={1}
                  className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-gray-900 placeholder:text-gray-400 max-h-40 text-sm leading-6 py-1"
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = 'auto';
                    t.style.height = `${Math.min(t.scrollHeight, 160)}px`;
                  }}
                  disabled={isLoading}
                />
                <button type="button" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mic className="h-4 w-4" />
                </button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 flex-shrink-0"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Emma can make mistakes. Verify important details with our team.
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIPropertySearch;
