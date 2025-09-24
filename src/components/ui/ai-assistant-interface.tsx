"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Search,
  ArrowUp,
  BookOpen,
  PenTool,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface AIAssistantInterfaceProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AIAssistantInterface({ isOpen, onClose }: AIAssistantInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{role: string, content: string, timestamp: Date}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCommandCategory, setActiveCommandCategory] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandSuggestions = {
    find: [
      "Visa lägenheter med havsutsikt i Antalya",
      "Hitta fastigheter under €300,000 i Turkiet", 
      "Vilka lägenheter finns i Alanya?",
      "Fastigheter lämpliga för turkiskt medborgarskap",
      "Visa lyxiga takvåningar i Dubai",
    ],
    invest: [
      "Bästa investeringsmöjligheterna i Turkiet",
      "Vilka områden har högsta hyresavkastningen?",
      "Fastigheter som berättigar till turkiskt pass",
      "Jämför investeringsavkastning per plats",
      "Fördelar och nackdelar med färdigbyggda vs nyproduktion",
    ],
    contact: [
      "Boka en fastighetsvisning",
      "Prata med en fastighetskonsult",
      "Få detaljerad fastighetsinformation",
      "Begär investeringskonsultation",
      "Boka virtuell fastighetstur",
    ],
  };

  const handleCommandSelect = (command: string) => {
    setInputValue(command);
    setActiveCommandCategory(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Add user message to chat
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage,
          conversationHistory: messages.slice(-5) // Keep last 5 messages for context
        }
      });

      if (error) throw error;

      // Add AI response to chat
      const aiMessage = {
        role: "assistant",
        content: data.response || "Jag kunde inte behandla din förfrågan just nu. Försök igen senare.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: "assistant",
        content: "Jag kunde inte behandla din förfrågan just nu. Försök igen senare.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                AI Property Assistant
              </DialogTitle>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Hitta din perfekta fastighet med vår AI som är tränad på hela databasen
            </p>
          </DialogHeader>
          
          {/* Chat Messages */}
          <div className="flex-1 p-6 pt-4 overflow-y-auto max-h-96">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Hej! Jag är din AI-fastighetsassistent. Hur kan jag hjälpa dig att hitta din perfekta bostad?</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 pt-0 border-t border-gray-200">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Fråga mig om fastigheter..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="w-full text-gray-700 text-base outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-end">
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                    inputValue.trim() && !isLoading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Command categories */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <CommandButton
                icon={<Search className="w-4 h-4" />}
                label="Hitta"
                isActive={activeCommandCategory === "find"}
                onClick={() =>
                  setActiveCommandCategory(
                    activeCommandCategory === "find" ? null : "find"
                  )
                }
              />
              <CommandButton
                icon={<Sparkles className="w-4 h-4" />}
                label="Investera"
                isActive={activeCommandCategory === "invest"}
                onClick={() =>
                  setActiveCommandCategory(
                    activeCommandCategory === "invest" ? null : "invest"
                  )
                }
              />
              <CommandButton
                icon={<PenTool className="w-4 h-4" />}
                label="Kontakt"
                isActive={activeCommandCategory === "contact"}
                onClick={() =>
                  setActiveCommandCategory(
                    activeCommandCategory === "contact" ? null : "contact"
                  )
                }
              />
            </div>

            {/* Command suggestions */}
            <AnimatePresence>
              {activeCommandCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-100 max-h-32 overflow-y-auto">
                      {commandSuggestions[
                        activeCommandCategory as keyof typeof commandSuggestions
                      ].map((suggestion, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleCommandSelect(suggestion)}
                          className="p-2 hover:bg-gray-50 cursor-pointer transition-colors duration-75"
                        >
                          <span className="text-xs text-gray-700">
                            {suggestion}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Logo with animated gradient */}
        <div className="mb-8 w-20 h-20 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 200 200"
            width="100%"
            height="100%"
            className="w-full h-full"
          >
            <g clipPath="url(#cs_clip_1_ellipse-12)">
              <mask
                id="cs_mask_1_ellipse-12"
                style={{ maskType: "alpha" }}
                width="200"
                height="200"
                x="0"
                y="0"
                maskUnits="userSpaceOnUse"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M100 150c27.614 0 50-22.386 50-50s-22.386-50-50-50-50 22.386-50 50 22.386 50 50 50zm0 50c55.228 0 100-44.772 100-100S155.228 0 100 0 0 44.772 0 100s44.772 100 100 100z"
                  clipRule="evenodd"
                ></path>
              </mask>
              <g mask="url(#cs_mask_1_ellipse-12)">
                <path fill="#fff" d="M200 0H0v200h200V0z"></path>
                <path
                  fill="#0066FF"
                  fillOpacity="0.33"
                  d="M200 0H0v200h200V0z"
                ></path>
                <g
                  filter="url(#filter0_f_844_2811)"
                  className="animate-gradient"
                >
                  <path fill="#0066FF" d="M110 32H18v68h92V32z"></path>
                  <path fill="#0044FF" d="M188-24H15v98h173v-98z"></path>
                  <path fill="#0099FF" d="M175 70H5v156h170V70z"></path>
                  <path fill="#00CCFF" d="M230 51H100v103h130V51z"></path>
                </g>
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_844_2811"
                width="385"
                height="410"
                x="-75"
                y="-104"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                ></feBlend>
                <feGaussianBlur
                  result="effect1_foregroundBlur_844_2811"
                  stdDeviation="40"
                ></feGaussianBlur>
              </filter>
              <clipPath id="cs_clip_1_ellipse-12">
                <path fill="#fff" d="M0 0H200V200H0z"></path>
              </clipPath>
            </defs>
            <g
              style={{ mixBlendMode: "overlay" }}
              mask="url(#cs_mask_1_ellipse-12)"
            >
              <path
                fill="gray"
                stroke="transparent"
                d="M200 0H0v200h200V0z"
                filter="url(#cs_noise_1_ellipse-12)"
              ></path>
            </g>
            <defs>
              <filter
                id="cs_noise_1_ellipse-12"
                width="100%"
                height="100%"
                x="0%"
                y="0%"
                filterUnits="objectBoundingBox"
              >
                <feTurbulence
                  baseFrequency="0.6"
                  numOctaves="5"
                  result="out1"
                  seed="4"
                ></feTurbulence>
                <feComposite
                  in="out1"
                  in2="SourceGraphic"
                  operator="in"
                  result="out2"
                ></feComposite>
                <feBlend
                  in="SourceGraphic"
                  in2="out2"
                  mode="overlay"
                  result="out3"
                ></feBlend>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Welcome message */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
              AI Property Assistant
            </h1>
            <p className="text-gray-500 max-w-md">
              Hitta din perfekta fastighet med vår AI tränad på hela databasen
            </p>
          </motion.div>
        </div>

        {/* Input area */}
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Fråga mig om fastigheter..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full text-gray-700 text-base outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-end">
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                inputValue.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command categories */}
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <CommandButton
            icon={<Search className="w-5 h-5" />}
            label="Hitta fastigheter"
            isActive={activeCommandCategory === "find"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "find" ? null : "find"
              )
            }
          />
          <CommandButton
            icon={<Sparkles className="w-5 h-5" />}
            label="Investering"
            isActive={activeCommandCategory === "invest"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "invest" ? null : "invest"
              )
            }
          />
          <CommandButton
            icon={<PenTool className="w-5 h-5" />}
            label="Kontakt"
            isActive={activeCommandCategory === "contact"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "contact" ? null : "contact"
              )
            }
          />
        </div>

        {/* Command suggestions */}
        <AnimatePresence>
          {activeCommandCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">
                    {activeCommandCategory === "find"
                      ? "Sökförslag"
                      : activeCommandCategory === "invest"
                      ? "Investeringsförslag"
                      : "Kontaktförslag"}
                  </h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {commandSuggestions[
                    activeCommandCategory as keyof typeof commandSuggestions
                  ].map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleCommandSelect(suggestion)}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-75"
                    >
                      <div className="flex items-center gap-3">
                        {activeCommandCategory === "find" ? (
                          <Search className="w-4 h-4 text-blue-600" />
                        ) : activeCommandCategory === "invest" ? (
                          <Sparkles className="w-4 h-4 text-blue-600" />
                        ) : (
                          <PenTool className="w-4 h-4 text-blue-600" />
                        )}
                        <span className="text-sm text-gray-700">
                          {suggestion}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
        isActive
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className={`${isActive ? "text-blue-600" : "text-gray-500"}`}>
        {icon}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-blue-700" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}