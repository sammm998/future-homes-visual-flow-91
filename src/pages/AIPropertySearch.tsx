import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/contexts/CurrencyContext';
import { MessageCircle, MapPin, Bed, Bath, Maximize } from 'lucide-react';

import { Link } from 'react-router-dom';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
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
  image?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

const AIPropertySearch = () => {
  console.log('AIPropertySearch component loaded - new version');
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Future AI assistant. How can I help you find the perfect property today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const placeholders = [
    "I'm looking for an apartment in Antalya near the beach",
    "What properties do you have in Dubai under €200,000?",
    "I want a villa with a pool in Cyprus",
    "Show me modern apartments in Mersin", 
    "Do you have any properties near golf courses?",
    "I'm looking for a high-yield investment",
    "Which areas do you recommend for families?",
    "Show properties with sea view"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputValue.trim();
    
    if (!query) return;

    // Clear input immediately
    setInputValue("");

    // Add user message to chat
    const userMessage: Message = {
      id: messages.length + 1,
      text: query,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send conversation history for context
      const conversationHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: query,
          conversationHistory: conversationHistory,
          conversationId: conversationId
        }
      });

      if (error) throw error;

      // Set conversation ID from response if not set
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: data.response || "Sorry, I couldn't find any suitable properties right now.",
        sender: "ai",
        timestamp: new Date(),
        propertyLinks: data.propertyLinks || []
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="AI Property Search | Smart Property Finder with AI Assistant"
        description="Use our AI-powered property search to find your perfect home. Chat with our intelligent assistant for personalized property recommendations."
        keywords="AI property search, smart property finder, AI assistant, intelligent property search, automated property matching"
        canonicalUrl="https://futurehomesinternational.com/ai-property-search"
      />
      <Navigation />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-20 pb-4">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-center sm:text-3xl text-foreground"
            >
              Ask Future Homes AI Anything
            </motion.h2>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex gap-4"
                >
                  <ChatBubbleAvatar 
                    src={message.sender === "user" ? userAvatar : aiAvatar}
                    fallback={message.sender === "user" ? "DU" : "AI"}
                    className={message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}
                  />
                  <div className="flex-1 max-w-[80%]">
                    <ChatBubbleMessage
                      variant={message.sender === "user" ? "sent" : "received"}
                      className={message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}
                    >
                      {message.text}
                    </ChatBubbleMessage>
                    
                    {/* Property Links */}
                    {message.propertyLinks && message.propertyLinks.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.propertyLinks.map((property) => (
                          <Link key={property.id} to={`/property/${property.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  {property.image && (
                                    <img
                                      src={property.image}
                                      alt={property.title}
                                      className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-2">{property.title}</h4>
                                    <div className="flex items-center gap-1 text-muted-foreground mb-2">
                                      <MapPin className="h-4 w-4" />
                                      <span className="text-sm">{property.location}</span>
                                    </div>
                                    
                                    {(property.bedrooms || property.bathrooms || property.area) && (
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                        {property.bedrooms && (
                                          <div className="flex items-center gap-1">
                                            <Bed className="h-3 w-3" />
                                            <span>{property.bedrooms}</span>
                                          </div>
                                        )}
                                        {property.bathrooms && (
                                          <div className="flex items-center gap-1">
                                            <Bath className="h-3 w-3" />
                                            <span>{property.bathrooms}</span>
                                          </div>
                                        )}
                                        {property.area && (
                                          <div className="flex items-center gap-1">
                                            <Maximize className="h-3 w-3" />
                                            <span>{property.area}m²</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    <div className="font-semibold text-primary">
                                      {property.price}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <ChatBubbleAvatar src={aiAvatar} fallback="AI" className="bg-muted" />
                  <div className="flex-1">
                    <ChatBubbleMessage isLoading />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 sticky bottom-0">
          <div className="container mx-auto max-w-4xl">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
              value={inputValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPropertySearch;