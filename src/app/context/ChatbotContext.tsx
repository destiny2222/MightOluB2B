"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser, selectCurrentView } from "@/redux/features/auth-slice";
import { sendChatbotMessage, BotResponse, ChatState } from "@/lib/chatbot-service";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  suggestedPrompts?: string[];
  isError?: boolean;
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  isServiceAvailable: boolean;
  accountType: "guest" | "b2c" | "b2b";
  setIsOpen: (isOpen: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  resetConversation: () => void;
  clearHistory: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const currentView = useSelector(selectCurrentView);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);
  const [chatState, setChatState] = useState<ChatState>({});

  // Determine accountType
  const getAccountType = (): "guest" | "b2c" | "b2b" => {
    if (!isAuthenticated || !user) return "guest";
    // Check B2B layout status
    if (currentView === "business") {
      return "b2b";
    }
    return "b2c";
  };

  const accountType = getAccountType();

  // Load message history from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("mightyolu_chat_messages");
    const storedState = sessionStorage.getItem("mightyolu_chat_state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsed);
      } catch (e) {
        console.error("Error loading chat history:", e);
      }
    }
    if (storedState) {
      try {
        setChatState(JSON.parse(storedState));
      } catch (e) {
        console.error("Error loading chat state:", e);
      }
    }
  }, []);

  // Sync messages & state to sessionStorage
  const saveChatToSession = (newMsgs: Message[], newState: ChatState) => {
    sessionStorage.setItem("mightyolu_chat_messages", JSON.stringify(newMsgs));
    sessionStorage.setItem("mightyolu_chat_state", JSON.stringify(newState));
  };

  // Helper to generate the welcome message based on accountType
  const getWelcomeMessage = useCallback((): Message => {
    const greeting = accountType === "b2b"
      ? `Welcome back to the Mightyolu Trade Assistant! How can I assist your business today?`
      : `Welcome to the Mightyolu Assistant! How can I help you today?`;

    const prompts = accountType === "b2b"
      ? ["Request a bulk quote", "Check my account balance", "Reorder my last bulk order", "Speak to my account manager"]
      : ["How to apply for Trade Account", "Delivery & Shipping", "Payment terms", "Contact info"];

    return {
      id: "welcome",
      sender: "bot",
      text: greeting,
      timestamp: new Date(),
      suggestedPrompts: prompts
    };
  }, [accountType]);

  // Handle welcome message when message list is empty
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = getWelcomeMessage();
      setMessages([welcome]);
      saveChatToSession([welcome], chatState);
    }
  }, [messages.length, getWelcomeMessage, chatState]);

  // Reset conversation on login / logout / view switch
  useEffect(() => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    setChatState({});
    setIsServiceAvailable(true);
    saveChatToSession([welcome], {});
  }, [accountType, getWelcomeMessage]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setIsLoading(true);

    try {
      const { response, newState } = await sendChatbotMessage(
        text,
        updatedMsgs,
        accountType,
        user,
        chatState
      );

      const botMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "bot",
        text: response.message,
        timestamp: new Date(),
        suggestedPrompts: response.suggestedPrompts,
        isError: response.isError
      };

      const finalMsgs = [...updatedMsgs, botMsg];
      setMessages(finalMsgs);
      setChatState(newState);
      setIsServiceAvailable(true);
      saveChatToSession(finalMsgs, newState);
    } catch (error) {
      console.error("Chatbot service error:", error);
      setIsServiceAvailable(false);
      const errorMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "bot",
        text: "Our assistant is temporarily unavailable — you can still reach us at inquiry@mightyolu.com or 07867986338.",
        timestamp: new Date(),
        isError: true
      };
      const finalMsgs = [...updatedMsgs, errorMsg];
      setMessages(finalMsgs);
      saveChatToSession(finalMsgs, chatState);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    setChatState({});
    setIsServiceAvailable(true);
    saveChatToSession([welcome], {});
  };

  const clearHistory = () => {
    sessionStorage.removeItem("mightyolu_chat_messages");
    sessionStorage.removeItem("mightyolu_chat_state");
    resetConversation();
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        isServiceAvailable,
        accountType,
        setIsOpen,
        sendMessage,
        resetConversation,
        clearHistory,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
