// components/enroll/EnrollClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { 
  Loader2, 
  DollarSign, 
  Users, 
  CheckCircle, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft // 🟢 Added ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// -----------------------------------------------------------------
// --- SVG Icons (Payment Methods) ---
// -----------------------------------------------------------------
const MpesaIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

// -----------------------------------------------------------------
// --- Interfaces ---
// -----------------------------------------------------------------
interface OrgLevel { 
  id: number; 
  name: string; 
  description: string; 
  order: number; 
}
interface OrgDetails { 
  name: string; 
  membership_price: string; // string from API
  slug: string; 
  org_type: string; 
  membership_period: string;
}

// -----------------------------------------------------------------
// --- Utilities ---
// -----------------------------------------------------------------
const MembershipNote = (membershipPeriod: string): string => {
  switch (membershipPeriod) {
    case "lifetime":
      return "One-time payment for unlimited access.";
    case "monthly":
      return "Billed monthly. Cancel anytime.";
    case "yearly":
      return "Billed annually. Renew to continue access.";
    default:
      return "Free membership access.";
  }
};

// -----------------------------------------------------------------
// --- Component ---
// -----------------------------------------------------------------
export default function EnrollClient({ orgSlug }: { orgSlug: string }) {
  const router = useRouter();

  // State
  const [organization, setOrganization] = useState<OrgDetails | null>(null);
  const [levels, setLevels] = useState<OrgLevel[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!orgSlug) {
        toast.error("Organization identifier missing.");
        router.push('/dashboard');
        return;
      }

      try {
        const [orgRes, levelsRes] = await Promise.all([
          api.get(`/organizations/${orgSlug}/`), 
          api.get(`/organizations/${orgSlug}/public-levels/`)
        ]);

        setOrganization(orgRes.data);
        const fetchedLevels = levelsRes.data || [];
        setLevels(fetchedLevels);
        setSelectedLevelId(fetchedLevels.length > 0 ? fetchedLevels[0].id : null);

      } catch (error) {
        toast.error("Failed to load enrollment details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [orgSlug, router]);

  // Handle Submit
  const handleSubmit = async () => {
    if (!organization || isSubmitting) return;

    const numericPrice = parseFloat(organization.membership_price) || 0;

    if (levels.length > 0 && selectedLevelId === null) {
      toast.warning("Please select a level to continue.");
      return;
    }

    if (numericPrice > 0 && !paymentMethod) {
      toast.warning("Please select a payment method.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Validate Enrollment
      const validationPayload = {
        organization_slug: organization.slug,
        org_level_id: selectedLevelId,
      };
      
      const validationRes = await api.post(`/organizations/${organization.slug}/validate_enrollment/`, validationPayload);
      const validationData = validationRes.data;

      if (validationData.status === 'active') {
        toast.success(validationData.detail || `Welcome to ${organization.name}!`);
        router.push(`/org/${organization.slug}/dashboard`);

      } else if (validationData.status === 'payment_required' && validationData.membership_id) {
        // 2. Initiate Payment
        toast.info("Initiating secure payment...");
        const paymentRes = await api.post(`/organizations/${organization.slug}/initiate_payment/`, {
          membership_id: validationData.membership_id,
          payment_method: paymentMethod,
        });

        const paymentData = paymentRes.data;
        if (paymentData.authorization_url) {
          window.location.href = paymentData.authorization_url;
        } else {
          throw new Error("Payment gateway URL missing.");
        }

      } else {
        toast.error(validationData.detail || "Enrollment initiation failed.");
      }

    } catch (err: any) {
      console.error("Enrollment Error:", err.response?.data || err);
      const detail = err.response?.data?.detail || "An unexpected error occurred.";
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!organization) return null;

  // Derived Values
  const numericPrice = parseFloat(organization.membership_price) || 0;
  const requiresLevelSelection = levels.length > 0;
  const priceDisplay = numericPrice > 0 ? `KES ${numericPrice.toLocaleString()}` : 'Free';
  const showPaymentOptions = numericPrice > 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      
      {/* 🟢 Back Button */}
      <div className="mb-6">
        <Button 
            variant="ghost" 
            onClick={() => router.push(`/organizations/browse/${orgSlug}`)}
            className="pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent group"
        >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Organization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Summary (1/3 width on desktop) */}
        <div className="md:col-span-1 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Complete Enrollment</h1>
                <p className="text-muted-foreground text-sm">Review your details and confirm your membership.</p>
            </div>

            <Card className="shadow-none border-border bg-muted/20">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Organization</span>
                        <span className="font-medium text-right">{organization.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Billing Cycle</span>
                        <span className="font-medium capitalize">{organization.membership_period}</span>
                    </div>
                    {selectedLevelId && (
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Level</span>
                            <Badge variant="outline" className="font-normal">
                                {levels.find(l => l.id === selectedLevelId)?.name}
                            </Badge>
                        </div>
                    )}
                    <Separator className="my-2"/>
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>{priceDisplay}</span>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                Secured by Paystack
            </div>
        </div>

        {/* RIGHT COLUMN: Form (2/3 width on desktop) */}
        <div className="md:col-span-2">
            <Card className="shadow-none border-border">
                <CardContent className="p-6 md:p-8 space-y-8">
                    
                    {/* Level Selection (Ensuring Full Width) */}
                    {requiresLevelSelection && (
                        <div className="space-y-4 w-full">
                            <label className="text-sm font-medium flex items-center text-foreground">
                                <GraduationCap className='w-4 h-4 mr-2 text-primary'/> 
                                Select Your Level / Track
                            </label>
                            <Select 
                                value={selectedLevelId?.toString() || ''} 
                                onValueChange={value => setSelectedLevelId(parseInt(value))} 
                                disabled={isSubmitting}
                            >
                                {/* 🟢 w-full ensures it takes full width */}
                                <SelectTrigger className="w-full h-11 bg-background">
                                    <SelectValue placeholder="Choose a grade level or track"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map(level => (
                                        <SelectItem key={level.id} value={level.id.toString()}>
                                            {level.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                This determines your specific curriculum access.
                            </p>
                        </div>
                    )}

                    {requiresLevelSelection && showPaymentOptions && <Separator />}

                    {/* Payment Methods */}
                    {showPaymentOptions && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium flex items-center text-foreground">
                                <DollarSign className='w-4 h-4 mr-2 text-primary'/> 
                                Payment Method
                            </label>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { id: "card", label: "Card", sub: "Credit / Debit", Icon: CardIcon },
                                    { id: "mobile_money_mpesa", label: "M-Pesa", sub: "Mobile Money", Icon: MpesaIcon },
                                ].map(({ id, label, sub, Icon }) => (
                                    <div 
                                        key={id} 
                                        onClick={() => setPaymentMethod(id)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/20",
                                            paymentMethod === id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-full", paymentMethod === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{label}</p>
                                            <p className="text-xs text-muted-foreground">{sub}</p>
                                        </div>
                                        {paymentMethod === id && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Membership Note */}
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-md text-sm text-blue-800">
                        {MembershipNote(organization.membership_period)}
                    </div>

                    {/* Action Button */}
                    <Button 
                        onClick={handleSubmit} 
                        className="w-full h-12 text-base font-semibold shadow-none"
                        disabled={isSubmitting || (requiresLevelSelection && selectedLevelId === null) || (showPaymentOptions && !paymentMethod)}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                        ) : (
                            <>
                                {numericPrice > 0 ? `Pay ${priceDisplay}` : 'Confirm Free Access'} 
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>

                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}