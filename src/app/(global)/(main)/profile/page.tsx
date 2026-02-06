"use client";

import { useAuth } from "@/context/AuthContext";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import api from "@/lib/api/axios";
import { toast } from "sonner";
import { 
  Camera, 
  LoaderCircle, 
  Download, 
  Eye, 
  X, 
  Award, 
  Trash2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const EmptyPlaceholder = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md">
    <p className="text-gray-500 text-sm italic">{message}</p>
  </div>
);

const Loader2 = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95%] sm:max-w-[420px] p-0 gap-0 border-border/80 rounded-md bg-background overflow-hidden [&>button]:hidden transition-all duration-300 top-[5%] md:top-[10%] translate-y-0 shadow-none"
      >
        <DialogHeader className="px-4 md:px-6 py-4 border-b bg-muted/50 flex flex-row items-center justify-between shrink-0 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-red-100/50 flex items-center justify-center shrink-0 border border-red-200/60">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <DialogTitle className="text-base md:text-lg font-bold tracking-tight text-foreground">
              {title}
            </DialogTitle>
          </div>
          <DialogClose className="rounded-md p-2 hover:bg-muted transition -mr-2">
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </DialogClose>
        </DialogHeader>

        <div className="p-4 md:p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                Are you sure you want to proceed with this action?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-md p-3 flex gap-3 items-start">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-[10px] md:text-[11px] text-red-700 font-bold uppercase tracking-wider leading-normal">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 py-4 border-t bg-muted/20 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0 mt-auto">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="h-11 md:h-10 w-full sm:w-auto px-6 rounded-md font-bold text-[11px] md:text-xs uppercase tracking-widest border-border shadow-none bg-background"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isLoading}
            className="h-11 md:h-10 w-full sm:w-auto px-6 rounded-md font-bold text-[11px] md:text-xs uppercase tracking-widest shadow-none bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface Certificate {
  certificate_uid: string;
  course_title: string;
  organization_name: string;
  issue_date: string;
}

interface Membership {
  id: number;
  organization_name: string;
  role: string;
}

interface ProfileData {
  username: string;
  email: string;
  avatar: string | null;
  bio: string;
  memberships: Membership[];
  certificates: Certificate[];
  enrolled_courses_count: number;
  completed_courses_count: number;
  certificates_count: number;
}

interface ProfileFormData {
  bio: string;
  avatar_file: File | null;
  avatar_preview: string | null;
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    bio: "",
    avatar_file: null,
    avatar_preview: null,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          setProfileLoading(true);
          const { data } = await api.get<ProfileData>("/users/profile/student/");
          setProfileData(data);

          setFormData({
            bio: data.bio || "",
            avatar_file: null,
            avatar_preview: data.avatar,
          });
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
          toast.error("Failed to load profile data.");
        } finally {
          setProfileLoading(false);
        }
      }
    };
    if (!authLoading && user) {
      fetchProfileData();
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    await logout();
    router.push("/");
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (formData.avatar_preview && formData.avatar_preview.startsWith("blob:")) {
        URL.revokeObjectURL(formData.avatar_preview);
      }

      setFormData({
        ...formData,
        avatar_file: file,
        avatar_preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profileData) return;
    
    setSubmitLoading(true);

    const submitData = new FormData();
    submitData.append("bio", formData.bio);
    
    if (formData.avatar_file) {
      submitData.append("avatar", formData.avatar_file);
    }

    try {
      const { data: updatedProfile } = await api.patch<ProfileData>(
        "/users/profile/student/",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfileData((prev) => {
        if (!prev) return updatedProfile;
        return {
          ...prev,
          ...updatedProfile,
          enrolled_courses_count: prev.enrolled_courses_count,
          completed_courses_count: prev.completed_courses_count,
          certificates_count: prev.certificates_count,
          memberships: prev.memberships,
          certificates: prev.certificates
        };
      });

      setFormData({
        bio: updatedProfile.bio || "",
        avatar_file: null,
        avatar_preview: updatedProfile.avatar,
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (profileData) {
      setFormData({
        bio: profileData.bio || "",
        avatar_file: null,
        avatar_preview: profileData.avatar,
      });
    }
  };

  const handleDownload = async (uid: string, title: string) => {
    try {
      const response = await api.get(`/courses/certificates/download/${uid}/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${title.replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download certificate.");
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
              <div className="bg-white border border-gray-200 p-6 rounded-md">
                <Skeleton className="w-40 h-40 rounded-full mx-auto mb-4" />
                <Skeleton className="w-3/4 h-6 mx-auto mb-2" />
                <Skeleton className="w-1/2 h-4 mx-auto mb-4" />
                <div className="border-t border-gray-100 pt-4">
                  <Skeleton className="w-full h-24 mb-4" />
                  <Skeleton className="w-full h-10" />
                </div>
              </div>
            </aside>
            <main className="flex-1 space-y-6">
              <div className="bg-white border border-gray-200 p-6 rounded-md">
                <Skeleton className="w-48 h-6 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-md">
                <Skeleton className="w-48 h-6 mb-4" />
                <Skeleton className="w-full h-16 mb-2" />
                <Skeleton className="w-full h-16" />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profileData) return null;

  const memberships = profileData.memberships || [];
  const certificates = profileData.certificates || [];

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <aside className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-6 rounded-md text-center">
              
              <form onSubmit={handleSubmit}>
                <div className="relative w-40 h-40 bg-gray-200 mb-4 overflow-hidden mx-auto rounded-full border-4 border-gray-100 group">
                  <Image
                    src={formData.avatar_preview || "/default-avatar.png"}
                    alt="Profile"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="text-white w-8 h-8" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profileData.username}
                </h2>
                <p className="text-gray-600 text-sm mb-3">{profileData.email}</p>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  {isEditing ? (
                    <div className="text-left">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-[#5c4b99] focus:border-transparent outline-none resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {profileData.bio || (
                        <span className="italic text-gray-500">
                          No bio available
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full bg-[#5c4b99] hover:bg-[#4a3a7d] text-white font-medium py-2 px-4 transition text-sm rounded-md disabled:opacity-70 flex items-center justify-center"
                    >
                      {submitLoading && <LoaderCircle className="animate-spin w-4 h-4 mr-2" />}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={submitLoading}
                      className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 transition text-sm rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[#5c4b99] hover:bg-[#4a3a7d] text-white font-medium py-2 px-4 transition text-sm rounded-md"
                  >
                    Edit Details
                  </button>
                )}
              </form>
            </div>
          </aside>

          <main className="flex-1 space-y-6 lg:space-y-8">
            
            <section className="bg-white border border-gray-200 p-4 sm:p-6 rounded-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                Learning Progress
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50/50 p-3 sm:p-4 text-center rounded-md border border-blue-100">
                  <p className="text-2xl sm:text-3xl font-bold text-[#5c4b99] mb-1">
                    {profileData.enrolled_courses_count}
                  </p>
                  <p className="text-xs text-blue-800 uppercase tracking-wider font-medium">
                    Enrolled
                  </p>
                </div>

                <div className="bg-green-50/50 p-3 sm:p-4 text-center rounded-md border border-green-100">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                    {profileData.completed_courses_count}
                  </p>
                  <p className="text-xs text-green-800 uppercase tracking-wider font-medium">
                    Completed
                  </p>
                </div>

                <div className="bg-yellow-50/50 p-3 sm:p-4 text-center rounded-md border border-yellow-100">
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">
                    {profileData.certificates_count}
                  </p>
                  <p className="text-xs text-yellow-800 uppercase tracking-wider font-medium">
                    Certificates
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-200 p-6 rounded-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                My Organizations
              </h3>
              {memberships.length > 0 ? (
                <ul className="space-y-4">
                  {memberships.map((membership) => (
                    <li
                      key={membership.id}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center transition-shadow hover:shadow-inner"
                    >
                      <div>
                        <p className="font-medium text-gray-800 text-base">
                          {membership.organization_name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize mt-1">
                          Role: {membership.role}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyPlaceholder message="You are not currently affiliated with any organizations." />
              )}
            </section>

            <section className="bg-white border border-gray-200 p-6 rounded-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                Certificates Earned
              </h3>
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.certificate_uid}
                      className="p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-[#5c4b99] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#fcfaff] p-2 rounded-md border border-gray-100">
                          <Award className="w-5 h-5 text-[#5c4b99]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{cert.course_title}</p>
                          <p className="text-xs text-gray-500">{cert.organization_name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedCert(cert)}
                          className="p-2 text-gray-400 hover:text-[#5c4b99] hover:bg-[#fcfaff] rounded-full transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownload(cert.certificate_uid, cert.course_title)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyPlaceholder message="You have not earned any certificates yet. Keep learning!" />
              )}
            </section>

            <section className="bg-white border border-gray-200 p-6 rounded-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-200 gap-2">
                  <p className="text-gray-700 text-sm">
                    Update your password for better security.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#5c4b99] hover:bg-[#4a3a7d] text-white text-xs font-medium py-2 px-3 transition whitespace-nowrap flex-shrink-0 rounded-md"
                  >
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <p className="text-gray-700 text-sm">
                    Receive learning updates via email.
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none border border-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5c4b99] peer-checked:border-[#5c4b99]"></div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-200 gap-2">
                  <p className="text-gray-700 text-sm">
                    Sign out safely from this device.
                  </p>
                  <button
                    onClick={handleSignOut}
                    disabled={signOutLoading}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 px-3 transition whitespace-nowrap disabled:opacity-50 flex-shrink-0 rounded-md"
                  >
                    {signOutLoading ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-2">
                  <div className="space-y-1.5">
                    <p className="text-gray-700 text-sm">
                      Permanently remove your account and all data.
                    </p>
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600 border border-amber-100 uppercase tracking-tight">
                      Under Development
                    </span>
                  </div>
                  <button 
                    disabled
                    className="bg-gray-100 text-gray-400 text-xs font-medium py-2 px-3 transition whitespace-nowrap flex-shrink-0 rounded-md cursor-not-allowed opacity-60 border border-gray-200"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {selectedCert && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#fcfaff] p-2 rounded-md hidden sm:block border border-gray-100">
                <Award className="w-5 h-5 text-[#5c4b99]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedCert.course_title}</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">UID: {selectedCert.certificate_uid.split('-')[0]}...</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => handleDownload(selectedCert.certificate_uid, selectedCert.course_title)}
                className="flex items-center gap-2 bg-[#5c4b99] hover:bg-[#4a3a7d] text-white px-3 sm:px-5 py-2 rounded-md text-xs sm:text-sm font-bold transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-12 md:py-20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:border-x-[1px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content bg-gray-50 flex justify-center">
            <div className="w-full max-w-4xl aspect-[1.414/1] bg-white border border-gray-200 relative p-6 sm:p-16 flex flex-col items-center justify-center text-center self-start shrink-0">
              
              <div className="absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-[#5c4b99]" />
              <div className="absolute bottom-4 right-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-[#5c4b99]" />

              <div className="mb-4 sm:mb-8">
                <img 
                  src="https://lh3.googleusercontent.com/d/1oRZwmxOAUnhlXG5LudFyVBfIk92Jcnbn" 
                  alt="Logo" 
                  className="h-10 sm:h-14 w-auto mx-auto mb-2"
                  crossOrigin="anonymous"
                />
                <div className="text-[9px] sm:text-[10px] font-bold text-[#94a3b8] tracking-[0.3em] uppercase">
                  {selectedCert.organization_name || "Evuka Independent Learning"}
                </div>
              </div>

              <h1 className="text-2xl sm:text-5xl font-light text-gray-900 tracking-[0.2em] uppercase mb-1 sm:mb-2">Certificate</h1>
              <p className="text-[8px] sm:text-[10px] text-[#94a3b8] tracking-[0.4em] uppercase mb-6 sm:mb-12">Of Completion</p>

              <p className="text-[10px] sm:text-xs italic text-[#94a3b8] mb-1 sm:mb-2">This is to certify that</p>
              <div className="text-xl sm:text-4xl font-bold text-[#1e293b] mb-4 sm:mb-10">{profileData.username}</div>
              
              <p className="text-[10px] sm:text-sm text-[#64748b] leading-relaxed max-w-[280px] sm:max-w-md">
                has successfully completed all requirements for the course
                <span className="block mt-1 sm:mt-2 text-base sm:text-xl font-bold text-[#5c4b99]">{selectedCert.course_title}</span>
              </p>

              <div className="mt-8 sm:mt-20 pt-4 border-t border-[#f1f5f9] w-full max-w-[150px] sm:max-w-xs text-center">
                <p className="text-[9px] sm:text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
                  Issued on {new Date(selectedCert.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] text-[#cbd5e1] font-mono tracking-tighter uppercase whitespace-nowrap">
                Validation: {selectedCert.certificate_uid} | e-vuka.com/verify
              </div>
            </div>
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
           setIsDeleteModalOpen(false);
        }}
        title="Delete Account"
        description="Permanently remove your account and all associated data from the Evuka Ecosystem."
      />
    </div>
  );
}