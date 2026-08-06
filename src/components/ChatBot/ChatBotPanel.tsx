"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChatbot, Message } from "@/app/context/ChatbotContext";
import QuickActions from "./QuickActions";

const formatMessageText = (text: string) => {
  if (!text) return "";
  
  // Basic markdown formatting
  let formatted = text;
  
  // Replace double newlines with paragraphs/br
  formatted = formatted.replace(/\n\n/g, '<div class="mb-2"></div>');
  formatted = formatted.replace(/\n/g, "<br />");
  
  // Replace bold syntax **text** with <strong>text</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Replace bullet points with styled inline bullet tags
  formatted = formatted.replace(/•\s(.*?)(<br \/>|$)/g, '<div class="flex items-start gap-1.5 ml-1.5 my-1"><span class="text-blue font-bold select-none">•</span><span>$1</span></div>');

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const ChatBotPanel: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    isServiceAvailable,
    sendMessage,
    resetConversation
  } = useChatbot();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages list changes or loading state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Mightyolu AI Shopping Assistant"
      className="fixed z-99999 md:bottom-6 md:right-6 bottom-0 right-0 md:w-[420px] w-full md:h-[620px] h-full bg-white md:rounded-2xl shadow-3xl flex flex-col overflow-hidden border border-gray-2 animate-fadeIn transition-all duration-300"
      style={{
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.18)",
      }}
    >
      {/* 1. Header Section */}
      <div className="bg-blue bg-gradient-to-r from-blue to-blue-dark text-white px-5 py-4 flex items-center justify-between border-b border-blue-dark/10">
        <div className="flex items-center gap-3">
          {/* Avatar Container */}
          <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3m-3.078-5.096a9.045 9.045 0 112.136 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue rounded-full"></span>
          </div>
          <div>
            <h2 className="font-bold text-base leading-tight">Mightyolu Assistant</h2>
            <p className="text-[11px] text-white/80 font-medium">B2B Trade & Retail Help</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset button */}
          <button
            onClick={resetConversation}
            title="Reset Conversation"
            aria-label="Reset Conversation"
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>

          {/* Close Panel Button */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant panel"
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors focus:ring-2 focus:ring-white/50"
          >
            <svg
              className="w-5.5 h-5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Message History Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            {/* Message Bubble wrapper */}
            <div
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4.5 py-3 text-custom-sm shadow-sm leading-relaxed
                  ${
                    msg.sender === "user"
                      ? "bg-blue text-white rounded-tr-none"
                      : msg.isError
                      ? "bg-red-50 text-red border border-red/10 rounded-tl-none font-medium"
                      : "bg-white text-dark-3 border border-gray-2 rounded-tl-none"
                  }
                `}
              >
                {formatMessageText(msg.text)}
              </div>
            </div>

            {/* Render Quick Action prompt chips directly under their bot response */}
            {msg.sender === "bot" && msg.suggestedPrompts && (
              <QuickActions prompts={msg.suggestedPrompts} />
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-dark-3 border border-gray-2 rounded-2xl rounded-tl-none px-4.5 py-3.5 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-4 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-gray-4 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-gray-4 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Form Area */}
      <div className="border-t border-gray-2 p-4 bg-white">
        {!isServiceAvailable ? (
          <div className="p-3 bg-red/5 rounded-xl border border-red/10 text-center">
            <p className="text-xs text-red font-medium leading-normal">
              Our assistant is temporarily offline.<br />
              Please contact us at <a href="mailto:inquiry@mightyolu.com" className="underline font-bold text-red">inquiry@mightyolu.com</a> or <a href="tel:07867986338" className="underline font-bold text-red">07867986338</a>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or request a quote..."
              aria-label="Ask Mightyolu Assistant"
              className="flex-1 bg-gray-1 border border-gray-3 hover:border-gray-4 focus:border-blue focus:bg-white text-custom-sm text-dark px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue/15"
              style={{ minHeight: "44px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className={`w-11 h-11 flex items-center justify-center rounded-xl text-white transition-all outline-none focus:ring-2 focus:ring-blue/30 active:scale-95
                ${
                  !input.trim() || isLoading
                    ? "bg-gray-3 cursor-not-allowed"
                    : "bg-blue hover:bg-blue-dark"
                }
              `}
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              <svg
                className="w-5 h-5 transform rotate-90"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatBotPanel;
