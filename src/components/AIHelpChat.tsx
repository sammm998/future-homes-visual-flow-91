
import { useState } from "react";
import { X, Send, MessageCircle, MapPin, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import userAvatar from "@/assets/avatars/user-avatar.jpg";
import aiAvatar from "@/assets/avatars/ai-avatar.jpg";
import { useTranslation } from "@/hooks/useTranslation";



interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  propertyLinks?: PropertyLink[];
}

interface PropertyLink {
  id: number;
  ref_no: string;
  title: string;
  price: string;
  location: string;
}

interface AIHelpChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIHelpChat({ isOpen, onClose }: AIHelpChatProps) {
  const { t, lang } = useTranslation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('ai.greeting'),
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [contactFormShown, setContactFormShown] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input after sending message
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Check if this is the 2nd user message and contact form hasn't been shown yet
      const userMessageCount = newMessages.filter(msg => msg.sender === "user").length;
      if (userMessageCount >= 2 && !showContactForm && !contactFormShown) {
        setTimeout(() => setShowContactForm(true), 2000); // Show form after AI response
        setContactFormShown(true); // Mark that form has been shown
      }
      return newMessages;
    });
    
    const currentMessage = newMessage;
    setNewMessage("");
    setIsLoading(true);

    try {
      console.log('Sending message to AI:', currentMessage);
      
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
          language: lang
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI response data:', data);

      // Set conversation ID from response if not set
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Remove markdown characters like * and # from the response
      const cleanResponse = (data.response || t('ai.fallback_error')).replace(/[*#]/g, '');
      
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
        text: t('ai.connection_issue'),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: t('ai.connection_error'),
        description: t('ai.connection_error_desc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactInfo.name && !contactInfo.email && !contactInfo.phone) {
      toast({
        title: t('ai.contact_required'),
        description: t('ai.contact_required_desc'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Use edge function to save contact (has proper permissions)
      const { data, error } = await supabase.functions.invoke('save-contact', {
        body: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
          conversation_id: conversationId,
          language: lang
        }
      });

      if (error) {
        console.error('Error from save-contact function:', error);
        throw error;
      }

      console.log('Contact saved successfully:', data);

      toast({
        title: t('ai.thank_you'),
        description: t('ai.contact_saved'),
      });

      setShowContactForm(false);
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: t('ai.error'),
        description: t('ai.contact_save_error'),
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full w-96 bg-background border-r shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">{t('ai.header')}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
          {messages.map((message) => (
            <div key={message.id} className="py-2">
              <div className="flex gap-3">
                <ChatBubbleAvatar 
                  src={message.sender === "user" ? userAvatar : aiAvatar}
                  fallback={message.sender === "user" ? "YOU" : "AI"}
                  className={message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}
                />
                 <div className="flex-1 min-w-0">
                   <ChatBubbleMessage
                     variant={message.sender === "user" ? "sent" : "received"}
                     className={message.sender === "user" ? "bg-primary text-primary-foreground ml-auto max-w-[85%] break-words whitespace-pre-wrap" : "bg-muted max-w-[85%] break-words whitespace-pre-wrap"}
                   >
                     {message.text}
                   </ChatBubbleMessage>
                  
                  {/* Property Links */}
                  {message.propertyLinks && message.propertyLinks.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.propertyLinks.map((property) => (
                        <Link key={property.id} to={`/property/${property.ref_no || property.id}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm mb-1">{property.title}</h4>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <MapPin size={12} />
                                    <span>{property.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1 font-semibold text-sm text-primary">
                                    <Euro size={12} />
                                    <span>{property.price}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString("en-US", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="py-2">
              <div className="flex gap-3">
                <ChatBubbleAvatar src={aiAvatar} fallback="AI" className="bg-muted" />
                <div className="flex-1">
                  <ChatBubbleMessage isLoading />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        {showContactForm && (
          <div className="border-t p-4 bg-muted/50">
            <div className="space-y-3">
              <div className="text-sm font-medium text-center">
                {t('ai.contact_prompt')}
              </div>
              <Input
                placeholder={t('ai.name_placeholder')}
                value={contactInfo.name}
                onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder={t('ai.email_placeholder')}
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                placeholder={t('ai.phone_placeholder')}
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleContactSubmit}
                  className="flex-1"
                  size="sm"
                >
                  {t('ai.save_contact')}
                </Button>
                <Button 
                  onClick={() => setShowContactForm(false)}
                  variant="outline"
                  size="sm"
                >
                  {t('ai.skip')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('ai.message_placeholder')}
              className="flex-1"
              disabled={isLoading}
              autoFocus
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
              className="h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
