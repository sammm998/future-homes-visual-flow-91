import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  X, 
  Home, 
  MapPin, 
  Euro, 
  Users,
  Bed,
  Bath,
  Maximize,
  Sparkles,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import userAvatar from "@/assets/avatars/user-avatar.jpg";
import aiAvatar from "@/assets/avatars/ai-avatar.jpg";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  propertyLinks?: PropertyLink[];
}

interface PropertyLink {
  id: number;
  title: string;
  price: string;
  location: string;
}

const AIPropertyAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hej! Jag är din AI-assistent för fastigheter. Jag kan hjälpa dig hitta den perfekta lägenheten baserat på dina önskemål. Vad letar du efter?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage("");
    setIsLoading(true);

    try {
      // Send conversation history for context
      const conversationHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: currentMessage,
          conversationHistory: conversationHistory,
          conversationId: conversationId,
          language: 'sv' // Default to Swedish for property assistant
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      // Set conversation ID from response if not set
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Remove markdown characters from the response
      const cleanResponse = (data.response || "Jag kunde inte behandla din förfrågan. Försök igen.").replace(/[*#]/g, '');
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: cleanResponse,
        sender: "ai",
        timestamp: new Date(),
        propertyLinks: data.propertyLinks || []
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI chat:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Jag har problem med anslutningen just nu. Försök igen om en stund.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Anslutningsfel",
        description: "Kunde inte ansluta till AI-assistenten. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Visa mig lägenheter i Istanbul under €200,000",
    "Jag letar efter en 2-rums lägenhet nära havet",
    "Vilka områden rekommenderar ni för investering?",
    "Visa fastigheter som ger turkiskt medborgarskap"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-primary-glow/5 to-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">AI Fastighetsassistent</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent">
              Hitta Din Drömfastighet
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Vår AI-assistent känner till alla våra 180+ fastigheter i detalj. Få personlig vägledning 
            för att hitta den perfekta investeringen baserat på dina önskemål och budget.
          </p>

          {/* 3D Floating Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              { icon: Home, title: "180+ Fastigheter", desc: "Tillgång till hela databasen" },
              { icon: MapPin, title: "Alla Destinationer", desc: "Turkiet, Dubai, Cypern, Bali" },
              { icon: Users, title: "24/7 Support", desc: "Omedelbar AI-assistans" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ 
                  y: -10, 
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                viewport={{ once: true }}
                className="relative group"
                style={{ perspective: "1000px" }}
              >
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main CTA Button with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary via-primary-glow to-primary text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span>Starta Konversation med AI</span>
                <MessageCircle className="w-5 h-5" />
              </div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-center text-lg font-medium mb-6 text-muted-foreground">
            Populära frågor att ställa:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setIsOpen(true);
                  setTimeout(() => {
                    setNewMessage(suggestion);
                  }, 500);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4 text-left hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-primary mt-1 group-hover:text-primary-glow transition-colors" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    "{suggestion}"
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl h-[80vh] bg-background border border-border rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary-glow/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={aiAvatar} alt="AI Assistant" className="w-10 h-10 rounded-full" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">AI Fastighetsassistent</h3>
                    <p className="text-sm text-muted-foreground">Online • Specialiserad på fastigheter</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatContainerRef}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <img 
                      src={message.sender === "user" ? userAvatar : aiAvatar}
                      alt={message.sender}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className={`max-w-[75%] ${message.sender === "user" ? "items-end" : ""}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.sender === "user" 
                          ? "bg-gradient-to-r from-primary to-primary-glow text-white" 
                          : "bg-muted"
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                      </div>
                      
                      {/* Property Links */}
                      {message.propertyLinks && message.propertyLinks.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.propertyLinks.map((property) => (
                            <Card key={property.id} className="hover:shadow-md transition-all cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-medium mb-2">{property.title}</h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                      <MapPin size={14} />
                                      <span>{property.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 font-semibold text-primary">
                                      <Euro size={14} />
                                      <span>{property.price}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString("sv-SE", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <img src={aiAvatar} alt="AI" className="w-8 h-8 rounded-full" />
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-border bg-gradient-to-r from-secondary/20 to-background">
                <div className="flex items-center gap-3">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Skriv ditt meddelande här..."
                    className="flex-1 rounded-2xl border-border/50 focus:border-primary"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    size="icon"
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AIPropertyAssistant;