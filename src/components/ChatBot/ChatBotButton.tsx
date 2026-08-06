"use client";

import React from "react";
import { useChatbot } from "@/app/context/ChatbotContext";

const ChatBotButton: React.FC = () => {
  const { isOpen, setIsOpen, isServiceAvailable } = useChatbot();

  if (isOpen) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      aria-label="Open Mightyolu assistant"
      className="fixed bottom-6 right-6 z-9999 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-blue hover:bg-blue-dark text-white transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-blue/30"
      style={{
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Pulse ring animation */}
      {isServiceAvailable && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-blue opacity-40 animate-ping pointer-events-none -z-10 group-hover:animate-none"></span>
      )}

      {/* Chat bubble SVG Icon */}
      <svg
        className="w-7.5 h-7.5 transition-transform duration-300 group-hover:rotate-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Down state indicator/warning badge if offline */}
      {!isServiceAvailable && (
        <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red"></span>
        </span>
      )}
    </button>
  );
};

export default ChatBotButton;
