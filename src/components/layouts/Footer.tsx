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

// --- Type Definitions ---
interface NavLink {
  href: string;
  text: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

// --- Constants ---
const QUICK_LINKS: NavLink[] = [
  { href: '/', text: 'Home' },
  { href: '/courses', text: 'Courses' },
  { href: '/events', text: 'Events' },
  { href: '/about', text: 'About Us' },
  { href: '/contact-us', text: 'Contact' },
];

const CREATOR_LINKS: NavLink[] = [
  { href: 'https://e-vuka.com/onboarding', text: 'Start Creating' },
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

// --- Logo Component ---
const Logo = () => (
  <div className="flex items-center gap-2">
    <svg height="32" viewBox="0 0 150 40" className="text-primary fill-current">
      <text x="45" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">
        D-VUKA
      </text>
      <path d="M5 5 L 25 5 L 25 35 L 5 35 Z" className="text-primary" />
      <path d="M5 20 L 35 20" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
  </div>
);

// --- Main Footer Component ---
const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border">
      
      {/* Newsletter Section */}
      <FooterNewsletter />

      {/* Main Links Content */}
      <div className="bg-secondary/5 pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 text-center md:text-left">
            
            {/* Column 1: Brand (Takes up 4 cols on large screens) */}
            <div className="lg:col-span-4 flex flex-col gap-4 items-center md:items-start">
              <Link href="/" className="inline-block">
                <img
                  src="/logo.png"
                  alt="evuka Logo"
                  className="max-w-[200px] h-auto object-contain"
                />
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Preserving African heritage while preparing learners for the digital future. 
                Join us to bridge the gap between culture and technology.
              </p>
              
              <div className="flex flex-col gap-2 mt-2 items-center md:items-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary shrink-0" /> Nairobi, Kenya
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary shrink-0" /> support@e-vuka.com
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links (2 cols) */}
            <div className="lg:col-span-2 flex flex-col items-center md:items-start">
              <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3 w-full">
                {QUICK_LINKS.map((link) => (
                  <li key={link.text}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline block py-1 md:py-0"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Creators (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center md:items-start">
              <h3 className="font-bold text-foreground mb-4">For Creators</h3>
              <ul className="space-y-3 w-full">
                {CREATOR_LINKS.map((link) => (
                  <li key={link.text}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline block py-1 md:py-0"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Support & Social (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center md:items-start">
              <h3 className="font-bold text-foreground mb-4">Support</h3>
              <ul className="space-y-3 mb-8 w-full">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.text}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline block py-1 md:py-0"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="w-full flex flex-col items-center md:items-start">
                <h4 className="font-bold text-foreground text-sm mb-4">Follow Us</h4>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-secondary/5 border-t border-border">
        <div className="container mx-auto px-4 py-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} E-Vuka. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
             <Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms</Link>
             <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;