"use client";

import React from "react";
import { useChatbot } from "@/app/context/ChatbotContext";

interface QuickActionsProps {
  prompts: string[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ prompts }) => {
  const { sendMessage, isLoading, isServiceAvailable } = useChatbot();

  if (!prompts || prompts.length === 0) return null;

  const handleClick = (prompt: string) => {
    if (isLoading || !isServiceAvailable) return;
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2" aria-label="Suggested quick replies">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => handleClick(prompt)}
          disabled={isLoading || !isServiceAvailable}
          className={`text-custom-sm font-semibold px-4.5 py-2.5 rounded-full border transition-all duration-200 text-left outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue
            ${
              !isServiceAvailable
                ? "bg-gray-2 text-gray-4 border-gray-3 cursor-not-allowed"
                : "bg-white hover:bg-gray-1 border-gray-3 text-dark hover:text-blue hover:border-blue active:scale-95"
            }
          `}
          style={{ minHeight: "42px" }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
