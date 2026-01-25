"use client";
import { UseChatOptions } from "@ai-sdk/react";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { DefaultChatTransport } from "ai";

const Page = () => {
  // @ts-ignore
  const { messages, sendMessage, isLoading, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  });
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    // @ts-ignore

    await sendMessage({ text: userInput });
    setUserInput("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-xl">
        <CardHeader className="border-b bg-card rounded-t-xl z-10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bot className="w-6 h-6" />
            AI Assistant
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((m: any) => (
                  <div key={m.id} className="flex gap-3">
                    {m.role === "user" ? (
                      <div className="flex w-full justify-end">
                        <Avatar className="w-8 h-8 border ml-2">
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className="flex gap-3 w-full">
                        <Avatar className="w-8 h-8 border">
                          <AvatarFallback>
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {m.parts.map((part: any) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div key={part.id} className="flex-1">
                              <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                                <ReactMarkdown>{part.text}</ReactMarkdown>
                              </div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                <Bot className="w-12 h-12" />
                <p>Ask me anything about food!</p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                Error: {error.message}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t bg-card rounded-b-xl">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} size="icon">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
