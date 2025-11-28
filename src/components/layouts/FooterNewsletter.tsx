"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Effect to clear the message after 5 seconds
  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await api.post("/users/newsletter/subscribe/", { email });
      
      setStatus("success");
      setMessage(response.data.message || "Successfully subscribed!");
      setEmail(""); 
    } catch (error: any) {
      console.error("Newsletter error:", error);
      setStatus("error");
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.email?.[0] || 
                       "Failed to subscribe. Please try again.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="bg-background border-b border-border py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          
          {/* Text Content */}
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center lg:justify-start gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Subscribe to our newsletter
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Join our community to receive updates on new courses, upcoming events, and exclusive content directly to your inbox.
            </p>
          </div>

          {/* Form Section */}
          <div className="w-full max-w-md flex flex-col gap-3">
            <form onSubmit={handleSubscribe} className="flex w-full gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-muted/30 border-border focus-visible:ring-primary h-11"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
              />
              <Button
                type="submit"
                className="font-semibold h-11 px-6 shadow-none"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>

            {/* Inline Feedback Message */}
            {message && (
              <div className={`text-sm font-medium flex items-center justify-center lg:justify-start gap-2 animate-in fade-in slide-in-from-top-1 ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}>
                {status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}