"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation"; // 1. Import useParams
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/axios";
import {
  Loader2,
  Facebook,
  Linkedin,
  Twitter,
  GraduationCap,
  Users2,
  Globe,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";

// ... [Interfaces stay exactly the same] ...
interface OrgStats {
  students: number;
  tutors: number;
  courses: number;
  upcoming_events: number;
}

interface OrganizationDetails {
  id: number;
  name: string;
  slug: string;
  org_type: string;
  description: string;
  membership_price: number;
  membership_period?: string;
  branding: {
    logo_url?: string;
    website?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  policies: {
    terms_of_service?: string;
    privacy_policy?: string;
    refund_policy?: string;
  };
  stats: OrgStats;
}

// ... [Helper Components stay exactly the same] ...
function SocialLink({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  const href = value.startsWith("http") ? value : `https://${value}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/10 border border-transparent hover:border-border transition-all group"
    >
      <div className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
          {value.replace(/^https?:\/\/(www\.)?/, "").split('/')[0]}
        </p>
      </div>
    </a>
  );
}

function JoinOrganizationButton({ org, currentMembership }: { org: OrganizationDetails, currentMembership: any }) {
    const router = useRouter();
    const [isJoining, setIsJoining] = useState(false);
    
    const isStudentMember = currentMembership && currentMembership.role === 'student' && currentMembership.is_active;
    const requiresPayment = org.membership_price > 0;

    const handleJoin = () => {
        router.push(`/enroll/initiate/${org.slug}`); 
    };

    if (isStudentMember) {
        return (
            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 py-1.5 px-4 text-sm font-bold shadow-none">
                <GraduationCap className="mr-2 h-4 w-4" /> Active Student
            </Badge>
        );
    }
    
    if (currentMembership && currentMembership.is_active) {
         return (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 py-1.5 px-4 text-sm font-bold shadow-none capitalize">
                <Users2 className="mr-2 h-4 w-4" /> {currentMembership.role}
            </Badge>
        );
    }

    return (
        <Button
            className="w-full sm:w-auto text-base font-bold h-11 px-8 shadow-none border-2 border-primary-foreground text-primary bg-primary-foreground hover:bg-primary-foreground/90 transition-all"
            onClick={handleJoin}
            disabled={isJoining}
        >
            {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {requiresPayment ? `Enroll Now` : "Join for Free"}
        </Button>
    );
}

// -----------------------------------------------------------------
// --- Main Component ---
// -----------------------------------------------------------------

export default function OrgProfileClient() {
  const router = useRouter();
  const params = useParams(); // 2. Get params directly from URL
  
  // 3. Extract the slug from the URL. This is the "Source of Truth".
  // Note: params.organizationSlug matches your folder name [organizationSlug]
  const currentSlug = params?.organizationSlug as string;

  const { user } = useAuth();
  const [org, setOrg] = useState<OrganizationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the URL slug to find membership, not the potentially stale context slug
  const currentMembership = user?.organizations?.find(
    (o: any) => o.organization_slug === currentSlug
  );

  const isActiveMember = currentMembership && currentMembership.is_active;

  const fetchOrgDetails = async () => {
    // 4. Guard clause using the URL slug
    if (!currentSlug) {
        setIsLoading(false);
        return;
    }
    try {
      setIsLoading(true);
      // 5. Fetch using the URL slug. This guarantees we fetch the page we are ON.
      const res = await api.get(`/organizations/${currentSlug}/details/`); 
      setOrg(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load organization details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOrg(null);
    fetchOrgDetails();
    // 6. Depend on currentSlug (URL) instead of activeSlug (Context)
  }, [currentSlug]);

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  
  if (!org) return null;

  const hasPolicies =
    org.policies?.terms_of_service ||
    org.policies?.privacy_policy ||
    org.policies?.refund_policy;

  return (
    <div className="bg-background min-h-screen pb-20">
      
      {/* === HERO SECTION === */}
      <div className="relative bg-primary text-primary-foreground px-6 pt-16 pb-20 md:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Logo */}
            <div className="h-28 w-28 md:h-36 md:w-36 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-none overflow-hidden flex items-center justify-center shrink-0">
              {org.branding?.logo_url ? (
                <Image
                  src={org.branding.logo_url}
                  alt={org.name}
                  width={144}
                  height={144}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl font-extrabold text-white/90">
                  {org.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Title & Desc */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-transparent mb-1">
                 {org.org_type === 'school' ? 'School' : 'Homeschool Network'}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {org.name}
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed mx-auto md:mx-0 line-clamp-2">
                {org.description || "Empowering minds through practical digital skills."}
              </p>
              
              {/* Action Buttons */}
              <div className="pt-4 flex justify-center md:justify-start">
                {isActiveMember ? (
                    <Button 
                        onClick={() => router.push(`/${org.slug}/dashboard`)} 
                        className="w-full sm:w-auto text-base font-bold h-11 px-8 shadow-none border-2 border-primary-foreground text-primary bg-primary-foreground hover:bg-primary-foreground/90 transition-all"
                    >
                        Go to Dashboard
                    </Button>
                ) : (
                    <JoinOrganizationButton 
                        org={org} 
                        currentMembership={currentMembership} 
                    />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === STATS BAR (Floating) === */}
      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-10">
          <div className="bg-card border border-border rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 shadow-sm">
             <div className="text-center">
                 <div className="text-3xl font-bold text-primary">{org.stats?.students ?? 0}</div>
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Students</div>
             </div>
             <div className="text-center border-l border-border">
                 <div className="text-3xl font-bold text-primary">{org.stats?.tutors ?? 0}</div>
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Tutors</div>
             </div>
             <div className="text-center border-l border-border">
                 <div className="text-3xl font-bold text-primary">{org.stats?.courses ?? 0}</div>
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Courses</div>
             </div>
             <div className="text-center border-l border-border">
                 <div className="text-3xl font-bold text-primary">{org.stats?.upcoming_events ?? 0}</div>
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Events</div>
             </div>
          </div>
      </div>

      {/* === MAIN CONTENT GRID === */}
      <div className="container mx-auto px-4 md:px-12 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Section */}
          <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 px-1">
                  About Us
              </h2>
              <Card className="shadow-none border-border">
                <CardContent className="p-5 text-muted-foreground leading-relaxed text-sm space-y-4">
                  {org.description ? (
                    org.description.split("\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p className="italic">No detailed description provided.</p>
                  )}
                </CardContent>
              </Card>
          </div>

          {/* Policies Section */}
          {hasPolicies && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 px-1">
                  Organization Policies
              </h2>
              <Card className="shadow-none border-border">
                <CardContent className="p-5">
                  <Tabs
                    defaultValue={
                      org.policies.terms_of_service
                        ? "terms"
                        : org.policies.privacy_policy
                        ? "privacy"
                        : "refund"
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50 p-1">
                        {org.policies.terms_of_service && (
                            <TabsTrigger value="terms">Terms</TabsTrigger>
                        )}
                        {org.policies.privacy_policy && (
                            <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        )}
                        {org.policies.refund_policy && (
                            <TabsTrigger value="refund">Refunds</TabsTrigger>
                        )}
                    </TabsList>

                    {org.policies.terms_of_service && (
                      <TabsContent value="terms" className="mt-0 prose prose-sm max-w-none text-muted-foreground prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-primary">
                          <div className="whitespace-pre-wrap">{org.policies.terms_of_service}</div>
                      </TabsContent>
                    )}

                    {org.policies.privacy_policy && (
                      <TabsContent value="privacy" className="mt-0 prose prose-sm max-w-none text-muted-foreground prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-primary">
                          <div className="whitespace-pre-wrap">{org.policies.privacy_policy}</div>
                      </TabsContent>
                    )}

                    {org.policies.refund_policy && (
                      <TabsContent value="refund" className="mt-0 prose prose-sm max-w-none text-muted-foreground prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-primary">
                          <div className="whitespace-pre-wrap">{org.policies.refund_policy}</div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <Card className="shadow-none border-border sticky top-6">
            <CardHeader className="p-5 pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold">Connect</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              
              {/* Social Links */}
              <div className="grid grid-cols-1 gap-1 mb-5">
                {org.branding?.website && (
                  <SocialLink icon={<Globe className="h-4 w-4" />} label="Website" value={org.branding.website} />
                )}
                {org.branding?.linkedin && (
                  <SocialLink icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" value={org.branding.linkedin} />
                )}
                {org.branding?.facebook && (
                  <SocialLink icon={<Facebook className="h-4 w-4" />} label="Facebook" value={org.branding.facebook} />
                )}
                {org.branding?.twitter && (
                  <SocialLink icon={<Twitter className="h-4 w-4" />} label="X (Twitter)" value={org.branding.twitter} />
                )}
                {!org.branding?.website && !org.branding?.linkedin && !org.branding?.facebook && !org.branding?.twitter && (
                    <p className="text-sm text-muted-foreground italic">No social links provided.</p>
                )}
              </div>

              {/* Membership Info (Always visible for context) */}
              <div className="bg-secondary/5 border border-border rounded-lg p-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-primary" /> Membership
                </h3>

                <div className="mb-4">
                    <p className="text-2xl font-bold text-foreground">
                    {org.membership_price > 0
                        ? `KES ${org.membership_price.toLocaleString()}`
                        : "Free"}
                    </p>
                    {org.membership_period && org.membership_price > 0 && (
                        <p className="text-xs text-muted-foreground font-medium capitalize">
                             per {org.membership_period}
                        </p>
                    )}
                </div>

                <div className="flex items-start gap-2 text-[10px] text-muted-foreground leading-tight">
                    <ShieldCheck className="w-3 h-3 mt-0.5 text-green-600 shrink-0" />
                    <span>Secure enrollment via E-Vuka Platform.</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}