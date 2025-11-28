"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add API logic here
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16">
            
            {/* Info Side */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Get in touch</h1>
                <p className="text-lg text-gray-600 mb-10">
                    Have questions about setting up your organization or need help with a course? 
                    Our team is here to help you bridge the gap.
                </p>

                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Mail className="text-[#2694C6]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Email</h3>
                            <p className="text-gray-600">support@evuka.com</p>
                            <p className="text-gray-600">partners@evuka.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Phone className="text-[#2694C6]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Phone</h3>
                            <p className="text-gray-600">+254 700 000 000</p>
                            <p className="text-gray-600">Mon-Fri from 8am to 5pm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <MapPin className="text-[#2694C6]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Office</h3>
                            <p className="text-gray-600">Evuka HQ, Practical Tech Park</p>
                            <p className="text-gray-600">Nairobi, Kenya</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                {submitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Send className="text-green-600" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                        <p className="text-gray-600">We'll get back to you shortly.</p>
                        <button 
                            onClick={() => setSubmitted(false)}
                            className="mt-6 text-[#2694C6] font-semibold hover:underline"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2694C6] focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2694C6] focus:border-transparent" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2694C6] focus:border-transparent" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2694C6] focus:border-transparent">
                                <option>General Inquiry</option>
                                <option>Organization/Partnership</option>
                                <option>Technical Support</option>
                                <option>Billing Issue</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea required rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2694C6] focus:border-transparent"></textarea>
                        </div>

                        <button type="submit" className="w-full bg-[#2694C6] text-white font-bold py-3 rounded-lg hover:bg-[#1f7ba5] transition-colors">
                            Send Message
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}