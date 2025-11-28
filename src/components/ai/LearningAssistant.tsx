"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Send, X, Bot, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/api/axios";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface LearningAssistantProps {
  courseSlug: string;
  currentLessonId?: number;
  courseTitle: string;
}

const LearningAssistant: React.FC<LearningAssistantProps> = ({
  courseSlug,
  currentLessonId,
  courseTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = useCallback(async () => {
    if (!courseSlug) return;
    setIsLoadingHistory(true);

    try {
      const res = await api.get(`/ai/history/${courseSlug}/`);
      setMessages(res.data || []);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post("/ai/ask/", {
        question: userMessage,
        course_slug: courseSlug,
        lesson_id: currentLessonId,
      });

      setMessages(res.data.history);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry — Vusela is currently offline. Please try again shortly.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleOpen = () => {
    if (!isOpen && messages.length === 0) fetchHistory();
    setIsOpen((prev) => !prev);
  };

  // CLOSED BUTTON
  if (!isOpen) {
    return (
      <button
        className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 z-50"
        onClick={handleToggleOpen}
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Card
      className="
        fixed bottom-4 right-4
        w-80 sm:w-96 md:w-[420px] max-w-[380px]
        h-[480px]
        flex flex-col
        gap-0
        z-[100] shadow-md rounded-md 
        overflow-hidden bg-white border
        p-0
      "
    >
      {/* HEADER — flush to top */}
      <div className="pt-3 pb-2 px-3 bg-primary text-white flex items-center justify-between">
        <span className="font-semibold text-md">Vusela</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleOpen}
          className="text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* COURSE TITLE — touching header */}
      <div className="px-3 py-2 text-xs text-muted-foreground border-b bg-gray-50 flex items-center">
        <BookOpen className="w-3 h-3 mr-1" /> {courseTitle}
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {isLoadingHistory ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[75%] text-sm px-3 py-2 
                    rounded-xl shadow 
                    ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-tl-none"
                    }
                  `}
                >
                  <ReactMarkdown
                    disallowedElements={["video", "audio", "iframe"]}
                    unwrapDisallowed
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vusela is typing…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* INPUT BAR */}
      <form onSubmit={handleSend} className="flex p-2 border-t bg-white space-x-2">
        <Input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping || isLoadingHistory}
          className="flex-1"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isTyping || !input.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};

export default LearningAssistant;
