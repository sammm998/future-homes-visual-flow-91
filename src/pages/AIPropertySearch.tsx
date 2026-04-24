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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sparkles, MapPin, Bed, Bath, Maximize, Send, Plus, MessageSquare, Menu, ArrowLeft, BookOpen } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import aiAvatar from "@/assets/avatars/ai-avatar.jpg";
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
  sender: "user" | "ai";
  timestamp: Date;
  propertyLinks?: PropertyLink[];
  articleLinks?: ArticleLink[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  conversationId: string | null;
  createdAt: Date;
}

const SUGGESTED_PROMPTS = [
  { icon: "🏖️", text: "Apartments in Antalya near the beach under €200,000" },
  { icon: "🏙️", text: "Luxury villas in Dubai Marina with sea view" },
  { icon: "🌴", text: "Investment properties in Cyprus" },
  { icon: "📚", text: "How does Turkish citizenship by investment work?" },
];

const STORAGE_KEY = 'futurehomes_ai_conversations';

const AIPropertySearch = () => {
  const { toast } = useToast();
  const routeLocation = useLocation();
  const lang = getCurrentLanguage(routeLocation.search);
  const propertyPath = getTranslatedPropertyPath(lang);
  const langParam = buildLangParam(lang);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const restored = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
        }));
        setConversations(restored);
        if (restored.length > 0) setActiveConvId(restored[0].id);
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    }
  }, []);

  // Persist conversations
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const messages = activeConv?.messages ?? [];

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const createNewConversation = (): Conversation => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: "New chat",
      messages: [],
      conversationId: null,
      createdAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    return newConv;
  };

  const handleNewChat = () => {
    createNewConversation();
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    let conv = activeConv;
    if (!conv) conv = createNewConversation();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };

    const isFirstMessage = conv.messages.length === 0;
    const updatedMessages = [...conv.messages, userMessage];

    setConversations(prev => prev.map(c =>
      c.id === conv!.id
        ? { ...c, messages: updatedMessages, title: isFirstMessage ? trimmed.slice(0, 40) : c.title }
        : c
    ));

    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = conv.messages.map(m => ({ sender: m.sender, text: m.text }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: trimmed,
          conversationHistory,
          conversationId: conv.conversationId,
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: data?.response || "Sorry, I couldn't process that. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        propertyLinks: data?.propertyLinks ?? [],
        articleLinks: data?.articleLinks ?? [],
      };

      setConversations(prev => prev.map(c =>
        c.id === conv!.id
          ? {
              ...c,
              messages: [...updatedMessages, aiMessage],
              conversationId: data?.conversationId ?? c.conversationId,
            }
          : c
      ));
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      };
      setConversations(prev => prev.map(c =>
        c.id === conv!.id ? { ...c, messages: [...updatedMessages, errorMessage] } : c
      ));
      toast({
        title: "Connection Error",
        description: "Could not reach AI assistant.",
        variant: "destructive",
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

  const ConversationsList = () => (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100">
      <div className="p-3 border-b border-zinc-800">
        <Button
          onClick={handleNewChat}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-zinc-500 px-3 py-2">No conversations yet</p>
          )}
          {conversations.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveConvId(c.id); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 transition-colors ${
                c.id === activeConvId
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800/60'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
              <span className="truncate">{c.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-zinc-800">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800">
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-zinc-900 text-zinc-100 overflow-hidden">
      <SEOHead
        title="AI Property Search | Future Homes International"
        description="Chat with our AI assistant trained on 180+ properties. Get personalized recommendations and explore our guides."
        keywords="AI property search, real estate AI, property assistant, futurehomes"
        canonicalUrl="https://futurehomesinternational.com/ai-property-search"
      />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 border-r border-zinc-800 flex-shrink-0">
        <ConversationsList />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-zinc-950 border-zinc-800">
          <ConversationsList />
        </SheetContent>
      </Sheet>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-zinc-300 hover:text-white hover:bg-zinc-800">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Future Homes AI</h1>
              <p className="text-xs text-zinc-400">Your personal property assistant</p>
            </div>
          </div>
        </header>

        {/* Messages or welcome */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4 max-w-3xl mx-auto text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                How can I help you today?
              </h2>
              <p className="text-zinc-400 mb-10 max-w-md">
                I know all 180+ Future Homes properties and can help you find the perfect one — or answer questions from our guides.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt.text)}
                    className="text-left p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{prompt.icon}</span>
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                        {prompt.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4"
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {msg.sender === 'ai' ? (
                        <>
                          <AvatarImage src={aiAvatar} alt="AI" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">AI</AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback className="bg-zinc-700 text-white text-xs">You</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-white">
                          {msg.sender === 'ai' ? 'Future Homes AI' : 'You'}
                        </span>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:text-white prose-strong:text-white prose-li:my-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {/* Property cards */}
                      {msg.propertyLinks && msg.propertyLinks.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {msg.propertyLinks.map((p) => (
                            <Link key={p.id} to={`/${propertyPath}/${p.id}${langParam}`}>
                              <Card className="overflow-hidden bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group">
                                {p.image && (
                                  <div className="aspect-video overflow-hidden">
                                    <img
                                      src={p.image}
                                      alt={p.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                                <CardContent className="p-3">
                                  <h4 className="font-semibold text-sm text-white line-clamp-1 mb-1">{p.title}</h4>
                                  <div className="flex items-center gap-1 text-zinc-400 text-xs mb-2">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{p.location}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
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
                                  <div className="text-sm font-bold text-blue-400">{p.price}</div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Article cards */}
                      {msg.articleLinks && msg.articleLinks.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium flex items-center gap-1.5">
                            <BookOpen className="h-3 w-3" />
                            Related guides
                          </p>
                          {msg.articleLinks.map((a) => (
                            <Link key={a.id} to={`/article/${a.slug}`}>
                              <Card className="bg-zinc-800/30 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all">
                                <CardContent className="p-3 flex gap-3 items-center">
                                  {a.image && (
                                    <img src={a.image} alt={a.title} className="h-14 w-14 object-cover rounded-md flex-shrink-0" loading="lazy" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-medium text-white line-clamp-1">{a.title}</h5>
                                    {a.excerpt && (
                                      <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{a.excerpt}</p>
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
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={aiAvatar} alt="AI" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1.5 pt-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 bg-zinc-900 p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 focus-within:border-zinc-600 transition-colors">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Future Homes AI..."
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-white placeholder:text-zinc-500 max-h-40 text-sm leading-6"
                style={{
                  minHeight: '24px',
                  height: 'auto',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
                }}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                className="h-8 w-8 rounded-lg bg-white text-zinc-900 hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-zinc-500 text-center mt-2">
              Future Homes AI can make mistakes. Verify important details with our team.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AIPropertySearch;
