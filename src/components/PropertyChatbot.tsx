import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle, Mic, MicOff, Home, Calendar, MapPin, Phone } from "lucide-react";
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

export function PropertyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI property assistant. How can I help you find your dream home today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
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
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isOpen, isLoading]);

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
      // Build conversation history
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

      const aiMessage: Message = {
        id: messages.length + 2,
        text: data.response || "I'm sorry, I couldn't process that. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        properties: data.properties || []
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if user wants to book
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
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get ephemeral token from edge function
      const { data, error } = await supabase.functions.invoke('chatbot-voice-token');
      
      if (error || !data?.client_secret?.value) {
        throw new Error('Failed to get voice token');
      }

      const EPHEMERAL_KEY = data.client_secret.value;

      // Create audio element
      audioRef.current = document.createElement("audio");
      audioRef.current.autoplay = true;

      // Create peer connection
      pcRef.current = new RTCPeerConnection();

      // Set up remote audio
      pcRef.current.ontrack = (e) => {
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
        }
      };

      // Add local audio track
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      pcRef.current.addTrack(ms.getTracks()[0]);

      // Set up data channel
      dcRef.current = pcRef.current.createDataChannel("oai-events");
      dcRef.current.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        console.log("Voice event:", event.type);
        
        // Handle transcription events
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
            const aiMessage: Message = {
              id: Date.now() + 1,
              text: aiText,
              sender: "ai",
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
          }
        }
      });

      // Create and set local description
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
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

  const quickActions = [
    { icon: Home, label: "Browse Properties", action: () => handleSendMessage("Show me available properties") },
    { icon: Calendar, label: "Book Viewing", action: () => setShowBookingForm(true) },
  ];

  const popularAreas = ["Dubai", "Antalya", "Cyprus"];

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
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1E293B] rounded-full shadow-lg flex items-center justify-center hover:bg-[#334155] transition-colors"
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
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header with Hero Image */}
            <div className="relative h-40 bg-gradient-to-b from-black/60 to-black/30">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                alt="Premium Real Estate"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs text-blue-300 font-medium tracking-wide">PREMIUM REAL ESTATE</p>
                <h2 className="text-2xl font-serif text-white mt-1">Find Your<br/>Dream Home</h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b space-y-3">
              {/* AI Property Search */}
              <button 
                onClick={() => {
                  handleSendMessage("Help me find a property");
                }}
                className="w-full flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-[#1E293B] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">AI Property Search</p>
                  <p className="text-sm text-gray-500">Describe what you're looking for</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Browse & Book Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={quickActions[0].action}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Browse Listings</span>
                </button>
                <button 
                  onClick={quickActions[1].action}
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Book Viewing</span>
                </button>
              </div>

              {/* Popular Areas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-blue-600 tracking-wide">POPULAR AREAS</p>
                  <button className="text-xs text-gray-500 hover:text-gray-700">See Map</button>
                </div>
                <div className="flex gap-2">
                  {popularAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() => handleSendMessage(`Show me properties in ${area}`)}
                      className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      message.sender === 'user' 
                        ? 'bg-[#1E293B] text-white rounded-br-md' 
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    
                    {/* Property Cards */}
                    {message.properties && message.properties.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.properties.map((property) => (
                          <Link key={property.id} to={`/property/${property.slug || property.id}`}>
                            <Card className="hover:shadow-md transition-shadow overflow-hidden">
                              <div className="flex">
                                {property.image && (
                                  <img 
                                    src={property.image} 
                                    alt={property.title}
                                    className="w-20 h-20 object-cover"
                                  />
                                )}
                                <CardContent className="p-2 flex-1">
                                  <h4 className="font-medium text-xs line-clamp-1">{property.title}</h4>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                    <MapPin size={10} />
                                    <span className="line-clamp-1">{property.location}</span>
                                  </div>
                                  <p className="text-xs font-semibold text-blue-600 mt-1">{property.price}</p>
                                </CardContent>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                  className="border-t bg-gray-50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Book a Viewing</h3>
                    <button onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <Input
                    placeholder="Your name"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="h-9 text-sm"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="h-9 text-sm"
                  />
                  <Input
                    placeholder="Phone"
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-9 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Date"
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="Time"
                      type="time"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>
                  <Button onClick={handleBookingSubmit} className="w-full h-9 text-sm" disabled={isLoading}>
                    Confirm Booking
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="border-t p-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={isVoiceActive ? stopVoiceChat : startVoiceChat}
                disabled={isVoiceConnecting}
                className={`h-10 w-10 rounded-full ${isVoiceActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'hover:bg-gray-100'}`}
              >
                {isVoiceConnecting ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : isVoiceActive ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about properties..."
                className="flex-1 h-10 rounded-full border-gray-200"
                disabled={isLoading || isVoiceActive}
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-10 w-10 rounded-full bg-[#1E293B] hover:bg-[#334155]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
