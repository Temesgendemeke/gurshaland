"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChatBubbleLeftRightIcon as MessageRoundedDetail,
  XMarkIcon as X,
  PaperAirplaneIcon as Send,
  HomeModernIcon as Restaurant,
  StopCircleIcon as StopCircle,
  CpuChipIcon as Chip,
} from "@heroicons/react/24/outline";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, sendMessage, error, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setIsTyping(true);
    sendMessage({ text: inputMessage });
    setInputMessage("");
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI chat assistant"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-primary-modern z-50"
      >
        <MessageRoundedDetail className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[calc(100vw-2rem)] max-w-md sm:w-[400px] h-[70vh] max-h-[900px] modern-card shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/60">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Restaurant className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm heading-primary">
              AI Cooking Assistant
            </h3>
            <p className="text-xs text-body-muted">Always here to help</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          className="w-8 h-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {messages.map((message, index) => (
          <div
            key={`message-${message.id}-${index} `}
            className={`flex gap-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="space-y-2">
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 order">
                  <Chip className="modern-bckground-gradient text-primary-foreground p-2 rounded-full w-10 h-10" />
                  <p className="text-body font-bold capitalize">GurshaAI</p>
                </div>
              )}
              <div className="order-1">
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <p
                          key={`${message.id}-${index}`}
                          className={`p-4 rounded-2xl ${
                            message.role === "user"
                              ? "modern-bckground-gradient"
                              : "bg-card/70 border border-border/60"
                          }`}
                        >
                          {part.text}
                        </p>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg border border-border/60">
              <p className="text-error">{error.message}</p>
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
      <div className="p-4 border-t border-border/60">
        <form className="flex space-x-2" onSubmit={handleSendMessage}>
          <Input
            placeholder="Ask about Ethiopian cooking..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 text-sm focus-modern"
          />
          {status === "streaming" ? (
            <Button type="button" onClick={stop}>
              <StopCircle />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="btn-primary-modern px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>
    </Card>
  );
}
