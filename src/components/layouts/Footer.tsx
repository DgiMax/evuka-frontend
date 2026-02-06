"use client";

import React from 'react';
import Link from "next/link";
import FooterNewsletter from './FooterNewsletter';
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook, 
  MapPin, 
  Mail, 
} from "lucide-react";

interface NavLink {
  href: string;
  text: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const QUICK_LINKS: NavLink[] = [
  { href: '/', text: 'Home' },
  { href: '/courses', text: 'Courses' },
  { href: '/events', text: 'Events' },
  { href: '/about', text: 'About Us' },
  { href: '/contact-us', text: 'Contact' },
];

const ECOSYSTEM_LINKS: NavLink[] = [
  { href: 'https://tutors.e-vuka.com/onboarding', text: 'Become a Tutor' },
  { href: 'https://publishers.e-vuka.com/', text: 'Become a Publisher' },
  { href: '/work-with-us', text: 'Partner With Us' },
  { href: '/organizations/browse', text: 'Organizations' },
];

const SUPPORT_LINKS: NavLink[] = [
  { href: '/help', text: 'Help Center / FAQs' },
  { href: '/terms-and-conditions', text: 'Terms of Service' },
  { href: '/privacy-policy', text: 'Privacy Policy' },
];

const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'YouTube', href: '#', icon: Youtube },
  { name: 'X (Twitter)', href: '#', icon: Twitter },
  { name: 'Facebook', href: '#', icon: Facebook },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border">
      
      <FooterNewsletter />

      <div className="bg-secondary/5 pt-12 md:pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            <div className="lg:col-span-4 flex flex-col gap-5 items-center md:items-start text-center md:text-left">
              <Link href="/" className="inline-block transition-opacity hover:opacity-90">
                <img
                  src="/logo.png"
                  alt="evuka Logo"
                  className="max-w-[150px] md:max-w-[180px] h-auto object-contain"
                />
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Preserving African heritage while preparing learners for the digital future. 
                Join our ecosystem to bridge the gap between culture and technology.
              </p>
              
              <div className="flex flex-col gap-3 mt-2 items-center md:items-start">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    Nairobi, Kenya
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-primary" />
                    </div>
                    support@e-vuka.com
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-4 sm:gap-8 text-center md:text-left">
                    
                    <div className="flex flex-col items-center md:items-start">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-6">Quick Links</h3>
                      <ul className="space-y-4 w-full">
                        {QUICK_LINKS.map((link) => (
                          <li key={link.text}>
                            <Link 
                              href={link.href} 
                              className="text-xs font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center md:justify-start gap-0 hover:gap-2 group"
                            >
                              <div className="hidden md:block w-0 group-hover:w-1.5 h-[1.5px] bg-primary transition-all"></div>
                              {link.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-6">Ecosystem</h3>
                      <ul className="space-y-4 w-full">
                        {ECOSYSTEM_LINKS.map((link) => (
                          <li key={link.text}>
                            <Link 
                              href={link.href} 
                              className="text-xs font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center md:justify-start gap-0 hover:gap-2 group"
                            >
                                <div className="hidden md:block w-0 group-hover:w-1.5 h-[1.5px] bg-primary transition-all"></div>
                              {link.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex flex-col items-center md:items-start">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-6">Support</h3>
                        <ul className="space-y-4 mb-10 w-full">
                          {SUPPORT_LINKS.map((link) => (
                            <li key={link.text}>
                              <Link 
                                href={link.href} 
                                className="text-xs font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center md:justify-start gap-0 hover:gap-2 group"
                              >
                                <div className="hidden md:block w-0 group-hover:w-1.5 h-[1.5px] bg-primary transition-all"></div>
                                {link.text}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <div className="w-full flex flex-col items-center md:items-start">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-4">Follow Us</h4>
                            <div className="flex gap-3">
                              {SOCIAL_LINKS.map((social) => (
                                <a
                                  key={social.name}
                                  href={social.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-9 h-9 rounded-md bg-white border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 flex items-center justify-center shadow-none active:scale-90"
                                  aria-label={social.name}
                                >
                                  <social.icon className="w-4 h-4" />
                                </a>
                              ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border-t border-border/50">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} evuka. Proudly African.</p>
          <div className="flex items-center gap-6">
              <span className="opacity-40">Privacy</span>
              <span className="opacity-40">Cookies</span>
              <span className="opacity-40">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;