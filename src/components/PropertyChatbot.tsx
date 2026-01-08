import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle, Mic, MicOff, Home, Calendar, MapPin, ChevronLeft, ChevronRight, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  properties?: PropertyResult[];
}

interface PropertyResult {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  bedrooms: string;
  slug?: string;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

type ChatView = "welcome" | "chat" | "voice";

export function PropertyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceConnecting, setIsVoiceConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const popularAreas = [
    { name: "Dubai", icon: "🏙️", color: "from-amber-400 to-orange-500" },
    { name: "Antalya", icon: "🌊", color: "from-blue-400 to-cyan-500" },
    { name: "Cyprus", icon: "🏝️", color: "from-emerald-400 to-teal-500" },
    { name: "Mersin", icon: "🌅", color: "from-purple-400 to-pink-500" },
    { name: "Bali", icon: "🌴", color: "from-green-400 to-emerald-500" },
  ];

  const quickActions = [
    { icon: Bot, label: "AI Chat", description: "Chat with our AI assistant", action: () => startChat() },
    { icon: Mic, label: "Voice", description: "Talk to our AI", action: () => setCurrentView("voice") },
    { icon: Home, label: "Browse", description: "View all listings", action: () => { startChat(); handleSendMessage("Show me available properties"); } },
    { icon: Calendar, label: "Book", description: "Schedule a viewing", action: () => { startChat(); setShowBookingForm(true); } },
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && currentView === "chat" && inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isOpen, currentView, isLoading]);

  const startChat = () => {
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        text: "Hello! I'm your AI property assistant. How can I help you find your dream home today?",
        sender: "ai",
        timestamp: new Date(),
      }]);
    }
    setCurrentView("chat");
  };

  const cleanAIResponse = (text: string): string => {
    // Remove markdown characters like *, #, **, etc.
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('property-chatbot', {
        body: { 
          message: messageText,
          conversationHistory
        }
      });

      if (error) throw error;

      const cleanedResponse = cleanAIResponse(data.response || "I'm sorry, I couldn't process that. Please try again.");

      const aiMessage: Message = {
        id: messages.length + 2,
        text: cleanedResponse,
        sender: "ai",
        timestamp: new Date(),
        properties: data.properties || []
      };

      setMessages(prev => [...prev, aiMessage]);

      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('book') || lowerText.includes('boka') || lowerText.includes('meeting') || lowerText.includes('möte') || lowerText.includes('visning')) {
        setTimeout(() => setShowBookingForm(true), 500);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm having trouble connecting. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date || !bookingForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to book a meeting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('property-chatbot', {
        body: { 
          action: 'book_meeting',
          bookingDetails: bookingForm
        }
      });

      if (error) throw error;

      toast({
        title: "Meeting Booked!",
        description: "We'll contact you shortly to confirm your appointment.",
      });

      setShowBookingForm(false);
      setBookingForm({ name: "", email: "", phone: "", date: "", time: "" });

      const confirmMessage: Message = {
        id: messages.length + 1,
        text: `Great! I've scheduled your meeting for ${bookingForm.date} at ${bookingForm.time}. Our team will contact you at ${bookingForm.email} or ${bookingForm.phone} to confirm.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmMessage]);

    } catch (error) {
      console.error('Error booking meeting:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceChat = useCallback(async () => {
    setIsVoiceConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke('chatbot-voice-token');
      
      if (error || !data?.client_secret?.value) {
        throw new Error('Failed to get voice token');
      }

      const EPHEMERAL_KEY = data.client_secret.value;

      audioRef.current = document.createElement("audio");
      audioRef.current.autoplay = true;

      pcRef.current = new RTCPeerConnection();

      pcRef.current.ontrack = (e) => {
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
        }
      };

      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      pcRef.current.addTrack(ms.getTracks()[0]);

      dcRef.current = pcRef.current.createDataChannel("oai-events");
      dcRef.current.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        console.log("Voice event:", event.type);
        
        if (event.type === 'response.audio.delta') {
          setIsSpeaking(true);
        }
        
        if (event.type === 'response.audio.done') {
          setIsSpeaking(false);
        }
        
        if (event.type === 'conversation.item.input_audio_transcription.completed') {
          const userText = event.transcript;
          if (userText) {
            const userMessage: Message = {
              id: Date.now(),
              text: userText,
              sender: "user",
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);
          }
        }
        
        if (event.type === 'response.audio_transcript.done') {
          const aiText = event.transcript;
          if (aiText) {
            const cleanedText = cleanAIResponse(aiText);
            const aiMessage: Message = {
              id: Date.now() + 1,
              text: cleanedText,
              sender: "ai",
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
          }
        }
      });

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await pcRef.current.setRemoteDescription(answer);
      setIsVoiceActive(true);
      
      toast({
        title: "Voice Chat Active",
        description: "You can now speak with the AI assistant.",
      });

    } catch (error) {
      console.error('Error starting voice chat:', error);
      toast({
        title: "Voice Chat Error",
        description: "Could not start voice chat. Please check your microphone permissions.",
        variant: "destructive",
      });
    } finally {
      setIsVoiceConnecting(false);
    }
  }, [toast]);

  const stopVoiceChat = useCallback(() => {
    dcRef.current?.close();
    pcRef.current?.close();
    dcRef.current = null;
    pcRef.current = null;
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
    setIsVoiceActive(false);
    setIsSpeaking(false);
    
    toast({
      title: "Voice Chat Ended",
      description: "Voice chat has been disconnected.",
    });
  }, [toast]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Property Carousel Component
  const PropertyCarousel = ({ properties }: { properties: PropertyResult[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % properties.length);
    };
    
    const prevSlide = () => {
      setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
    };

    if (properties.length === 0) return null;

    return (
      <div className="mt-3 relative">
        <div className="overflow-hidden rounded-xl">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {properties.map((property) => (
              <Link 
                key={property.id} 
                to={`/property/${property.slug || property.id}`}
                className="min-w-full"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {property.image && (
                    <div className="relative h-32">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="text-xs font-semibold text-blue-600">{property.price}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-1 text-gray-900">{property.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={10} />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    {property.bedrooms && (
                      <span className="text-xs text-gray-400 mt-1 block">{property.bedrooms} bedrooms</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {properties.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.preventDefault(); prevSlide(); }}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); nextSlide(); }}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight size={14} />
            </button>
            <div className="flex justify-center gap-1 mt-2">
              {properties.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Welcome View
  const WelcomeView = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">ChatIQ</h2>
            <p className="text-xs text-blue-100">AI Property Assistant</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Premium Plan</span>
          </div>
          <p className="text-xs text-blue-100">Find your perfect property with AI-powered assistance</p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Quick Access</h3>
          <button className="text-xs text-blue-600 hover:text-blue-700">See All</button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.action}
              className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                <action.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Popular Areas */}
        <h3 className="font-semibold text-gray-900 mb-3">Popular Areas</h3>
        <div className="space-y-2">
          {popularAreas.map((area, idx) => (
            <button
              key={idx}
              onClick={() => { startChat(); handleSendMessage(`Show me properties in ${area.name}`); }}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center text-lg`}>
                {area.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{area.name}</p>
                <p className="text-xs text-gray-500">Explore properties</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Voice View
  const VoiceView = () => (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setCurrentView("welcome")}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="font-semibold text-white">Voice</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Voice Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative mb-8">
          {/* Animated rings */}
          <motion.div
            animate={isVoiceActive && isSpeaking ? { 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 w-40 h-40 bg-blue-400/30 rounded-full -m-8"
          />
          <motion.div
            animate={isVoiceActive && isSpeaking ? { 
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.2, 0.4]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="absolute inset-0 w-32 h-32 bg-blue-400/40 rounded-full -m-4"
          />
          
          {/* Main circle */}
          <motion.div
            animate={isVoiceActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl"
          >
            {isVoiceConnecting ? (
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {isVoiceActive ? (
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={isSpeaking ? { height: [8, 20, 8] } : { height: 8 }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </div>
            )}
          </motion.div>
        </div>

        <p className="text-white/80 text-center text-sm mb-8 max-w-[200px]">
          {isVoiceActive 
            ? isSpeaking 
              ? "AI is speaking..." 
              : "Listening... speak now"
            : "Online education offers flexibility to learn at your own pace, access to a wide range of courses from......"
          }
        </p>

        {/* Control Button */}
        <button
          onClick={isVoiceActive ? stopVoiceChat : startVoiceChat}
          disabled={isVoiceConnecting}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
            isVoiceActive 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          {isVoiceConnecting ? (
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : isVoiceActive ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-blue-600" />
          )}
        </button>
        
        <p className="text-white/60 text-xs mt-4">
          {isVoiceActive ? "Tap to end call" : "Tap to start voice chat"}
        </p>
      </div>
    </div>
  );

  // Chat View
  const ChatView = () => (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <button
          onClick={() => setCurrentView("welcome")}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">ChatIQ</h3>
          <p className="text-xs text-green-500">● Online</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/50 to-white" ref={chatContainerRef}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%]`}>
              <div className={`rounded-2xl px-4 py-3 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md' 
                  : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              
              {/* Property Carousel */}
              {message.properties && message.properties.length > 0 && (
                <PropertyCarousel properties={message.properties} />
              )}
              
              <p className="text-xs text-gray-400 mt-1 px-1">
                {message.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1.5">
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-blue-400 rounded-full" />
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-blue-400 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Form */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t bg-white p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-900">Book a Viewing</h3>
              <button onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <Input
              placeholder="Your name"
              value={bookingForm.name}
              onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
              className="h-9 text-sm rounded-xl"
            />
            <Input
              placeholder="Email"
              type="email"
              value={bookingForm.email}
              onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
              className="h-9 text-sm rounded-xl"
            />
            <Input
              placeholder="Phone"
              type="tel"
              value={bookingForm.phone}
              onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
              className="h-9 text-sm rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={bookingForm.date}
                onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                className="h-9 text-sm rounded-xl"
              />
              <Input
                type="time"
                value={bookingForm.time}
                onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                className="h-9 text-sm rounded-xl"
              />
            </div>
            <Button onClick={handleBookingSubmit} className="w-full h-9 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600" disabled={isLoading}>
              Confirm Booking
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t bg-white p-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("voice")}
            className="h-9 w-9 rounded-xl hover:bg-white"
          >
            <Mic className="w-4 h-4 text-gray-500" />
          </Button>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a prompt..."
            className="flex-1 h-9 border-0 bg-transparent focus-visible:ring-0 text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[650px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {currentView === "welcome" && <WelcomeView />}
            {currentView === "voice" && <VoiceView />}
            {currentView === "chat" && <ChatView />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
