"use client";

import React from "react";
import Image from "next/image";
import { Building2, Users, Trophy, Lightbulb, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you have this

export default function AboutPage() {
  return (
    <div className="bg-white font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Practical E-Learning <span className="text-[#2694C6]">Reimagined</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 mb-10">
            Evuka bridges the gap between theoretical online coursework and practical, 
            community‑driven education. We believe learning happens when you interact, 
            build, and experience.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="w-12 h-12 bg-[#2694C6]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="text-[#2694C6]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Organizational Alignment</h3>
              <p className="text-gray-600">
                Schools and training institutions maintain their identity. Manage your own students, 
                content, and custom taxonomy within our ecosystem.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="w-12 h-12 bg-[#2694C6]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-[#2694C6]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Event-Driven</h3>
              <p className="text-gray-600">
                Theory meets practice. Tutors host Hackathons, Workshops, and Live Classes 
                tied directly to the curriculum via Jitsi Meet.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="w-12 h-12 bg-[#2694C6]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-[#2694C6]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Measurable Progress</h3>
              <p className="text-gray-600">
                With deep analytics, lesson progress tracking, and auto-graded quizzes, 
                we ensure every step forward is counted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack / Trust Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Powered by Modern Technology</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
                <div className="flex flex-col items-center gap-2">
                    <Globe size={32} />
                    <span className="font-semibold">Secure Live Video</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Lightbulb size={32} />
                    <span className="font-semibold">AI Assistance</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={32} />
                    <span className="font-semibold">Real-time Data</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Building2 size={32} />
                    <span className="font-semibold">Secure Payments</span>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}