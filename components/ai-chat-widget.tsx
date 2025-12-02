"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles, ChefHat } from "lucide-react";
import { getResponse } from "@/actions/ai/getResponse";
import { useAssistant } from "@/hooks/useAssistant";
import { useQuery } from "@tanstack/react-query";
import set from "date-fns/esm/fp/set/index.js";

const fetchResponse = async (prompt: String) => {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt }),
    });
    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching response." };
  }
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your Ethiopian cooking assistant. Ask me about recipes, ingredients, or cooking techniques!",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { refetch, data, error, isLoading, isEnabled, isFetching } = useQuery({
    queryKey: ["assistant", inputMessage],
    queryFn: async () => await fetchResponse(inputMessage),
    enabled: false,
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // const res = await fetchResponse(inputMessage);
    const { data } = await refetch();

    if (!data || typeof data.text !== "string") {
      const errorMessage =
        (data && (data.error as string)) ||
        "The assistant couldn't generate a response. Please try again.";
      const errorMsg = {
        id: messages.length + 2,
        type: "ai",
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsTyping(false);
      return;
    }

    const aiResponse = {
      id: messages.length + 2,
      type: "ai",
      content: data.text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-primary-modern shadow-lg hover:shadow-xl z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[500px] h-[700px] modern-card shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm heading-primary">
              AI Cooking Assistant
            </h3>
            <p className="text-xs text-body-muted">Always here to help</p>
          </div>
        </div>

        <div>
          error: {JSON.stringify(error)} <br />
          loading: {JSON.stringify(isLoading)} <br />
          enabled: {JSON.stringify(isEnabled)} <br />
          fetching: {JSON.stringify(isFetching)} <br />
          data: {JSON.stringify(data) === null
            ? "null"
            : JSON.stringify(data)}{" "}
          <br />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.type === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-body"
              }`}
            >
              {message.type === "ai" && (
                <div className="flex items-center space-x-1 mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">
                    AI Assistant
                  </span>
                </div>
              )}
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div
          key={`bottom-${messages.length}`}
          ref={(el) => {
            el?.scrollIntoView({ behavior: "smooth", block: "end" });
          }}
        />
      </div>
      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about Ethiopian cooking..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 text-sm focus-modern"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="sm"
            className="btn-primary-modern px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
