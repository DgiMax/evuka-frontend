"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg"; 
import api from "@/lib/api/axios";
import { 
  Loader2, 
  ArrowLeft, 
  User, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { toast } from "sonner";

// --- Interfaces ---
interface MemberProfile {
  display_name: string;
  bio: string;
  headline: string;
  profile_image: string | null;
  education: string;
}

interface OrgSubject {
  id: number;
  name: string;
}

interface TeamMember {
  id: number;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: MemberProfile | null;
  subjects: OrgSubject[];
}

interface TeamData {
  management: TeamMember[];
  tutors: TeamMember[];
}

// --- Components ---

// 1. Member Card Component
const MemberCard = ({ member, onClick }: { member: TeamMember; onClick: (m: TeamMember) => void }) => {
  const displayName = member.profile?.display_name || `${member.first_name} ${member.last_name}`;
  const headline = member.profile?.headline || (member.role === 'owner' ? 'Organization Owner' : 'Team Member');
  const imageSrc = member.profile?.profile_image;

  return (
    <div 
      onClick={() => onClick(member)}
      className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-200"
    >
      {/* Image Area */}
      <div className="h-48 w-full bg-secondary/10 relative overflow-hidden flex items-center justify-center">
        {imageSrc ? (
          <Image 
            src={imageSrc} 
            alt={displayName} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <User className="w-16 h-16 text-muted-foreground/30" />
        )}
        
        {/* Role Badge Overlay */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm shadow-sm capitalize border-white/20">
            {member.role}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {displayName}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
          {headline}
        </p>

        {member.subjects && member.subjects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-1">
            {member.subjects.slice(0, 2).map(sub => (
              <span key={sub.id} className="text-[10px] bg-secondary/10 text-muted-foreground px-2 py-1 rounded-sm border border-border">
                {sub.name}
              </span>
            ))}
            {member.subjects.length > 2 && (
              <span className="text-[10px] bg-secondary/10 text-muted-foreground px-2 py-1 rounded-sm border border-border">
                +{member.subjects.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Main Page Component
export default function OrgTeamView() {
  const router = useRouter();
  const { activeSlug } = useActiveOrg(); 
  
  const [data, setData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeam = async () => {
    if (!activeSlug) {
        setIsLoading(false);
        return;
    }

    try {
      setIsLoading(true);
      // 🟢 UPDATED URL: matches 'team/<slug>/' inside organizations app
      const res = await api.get(`/organizations/org-team/${activeSlug}/`);
      setData(res.data);
    } catch (error) {
      console.error("Failed to load team:", error);
      toast.error("Failed to load team members.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [activeSlug]);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle case where organization is not found or data is missing
  if (!activeSlug || !data) return null;

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/${activeSlug}/`)}
            className="pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent group mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Organization
          </Button>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">Meet the Team</h1>
          <p className="text-muted-foreground mt-2">The dedicated professionals driving our mission forward.</p>
        </div>

        {/* Management Section */}
        {data.management.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded text-primary">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Leadership & Administration</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.management.map(member => (
                <MemberCard key={member.id} member={member} onClick={handleMemberClick} />
              ))}
            </div>
          </div>
        )}

        {/* Tutors Section */}
        {data.tutors.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded text-primary">
                    <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Our Tutors</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.tutors.map(member => (
                <MemberCard key={member.id} member={member} onClick={handleMemberClick} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {data.management.length === 0 && data.tutors.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-lg border border-dashed border-border text-center">
              <Users className="w-10 h-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No team members are publicly listed yet.</p>
           </div>
        )}

        {/* --- MEMBER DETAIL MODAL --- */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border gap-0">
            
            {selectedMember && (
              <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
                    
                    {/* Left: Image & Quick Info */}
                    <div className="w-full md:w-2/5 bg-muted/30 border-b md:border-b-0 md:border-r border-border p-8 flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-sm mb-4">
                            {selectedMember.profile?.profile_image ? (
                                <Image 
                                    src={selectedMember.profile.profile_image} 
                                    alt={selectedMember.first_name} 
                                    fill 
                                    className="object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                                    <User className="w-12 h-12 text-muted-foreground/40" />
                                </div>
                            )}
                        </div>
                        
                        <h2 className="text-xl font-bold text-foreground">
                            {selectedMember.profile?.display_name || `${selectedMember.first_name} ${selectedMember.last_name}`}
                        </h2>
                        
                        <Badge variant="outline" className="mt-2 capitalize bg-white text-primary border-primary/20">
                            {selectedMember.role}
                        </Badge>

                        {selectedMember.profile?.headline && (
                            <p className="text-sm text-muted-foreground mt-4 italic leading-relaxed">
                                "{selectedMember.profile.headline}"
                            </p>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-lg font-bold">Profile Details</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">Information provided by the member.</DialogDescription>
                        </DialogHeader>

                        {/* Bio */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-primary" /> About
                                </h4>
                                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {selectedMember.profile?.bio || "No biography provided."}
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            {/* Education */}
                            {selectedMember.profile?.education && (
                                <div>
                                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                                        <Briefcase className="w-4 h-4 text-primary" /> Education
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedMember.profile.education}
                                    </p>
                                </div>
                            )}

                            {/* Subjects */}
                            {selectedMember.subjects.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                                        <BookOpen className="w-4 h-4 text-primary" /> Areas of Focus
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMember.subjects.map(sub => (
                                            <Badge key={sub.id} variant="secondary" className="font-normal border border-border">
                                                {sub.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}