"use client"

import { useAuth } from "@/context/AuthContext"
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import api from "@/lib/api/axios";

// --- Custom Components ---
const EmptyPlaceholder = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md">
    <p className="text-gray-500 text-sm italic">{message}</p>
  </div>
);

// --- Types (Unchanged) ---
interface Certificate {
  id: number;
  course_title: string;
}
interface Membership {
  id: number;
  organization_name: string;
  role: string;
}
interface ProfileData {
  username: string;
  email: string;
  phone_number: string;
  avatar: string | null;
  bio: string;
  memberships: Membership[];
  certificates: Certificate[];
  enrolled_courses_count: number;
  completed_courses_count: number;
  certificates_count: number;
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Fetching Logic (Unchanged) ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          setProfileLoading(true)
          const { data } = await api.get("/users/profile/student/")
          setProfileData(data)
        } catch (error) {
          console.error("Failed to fetch profile data:", error)
        } finally {
          setProfileLoading(false)
        }
      }
    }
    fetchProfileData()
  }, [user])

  const handleSignOut = async () => {
    setSignOutLoading(true)
    await logout()
    router.push("/")
  }

  // --- Loading State (Unchanged) ---
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading Profile...</p>
      </div>
    )
  }

  // Use || [] for safe array access (handles API returning null/undefined)
  if (!user || !profileData) return null

  const memberships = profileData.memberships || [];
  const certificates = profileData.certificates || [];

  // --- Render the Updated Layout ---
  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl"> {/* Increased max-width slightly */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8"> {/* Adjusted gap for better flow */}

          {/* === Left Sidebar (Profile Card) === */}
          <aside className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
            {/* 🟢 FIX: Ensure text-center is applied to the container */}
            <div className="bg-white border border-gray-200 p-6 rounded-md shadow-sm text-center"> 
              
              <div className="w-40 h-40 bg-gray-200 mb-4 overflow-hidden mx-auto rounded-full border-4 border-gray-100"> 
                <Image
                  src={profileData.avatar || "/default-avatar.png"}
                  alt="Profile"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.username}</h2>
              <p className="text-gray-600 text-sm mb-1">{profileData.email}</p>
              <p className="text-gray-600 text-sm mb-3">{profileData.phone_number || "No phone number"}</p>
              
              <p className="text-gray-700 text-sm mb-4 leading-relaxed border-t border-gray-100 pt-4">
                {profileData.bio || <span className="italic text-gray-500">No bio available</span>}
              </p>
              
              {/* 🟢 FIX: Use bg-primary (assuming Tailwind config) and rounded-md */}
              <button className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 transition text-sm rounded-md shadow-md">
                Edit Details
              </button>
            </div>
          </aside>

          {/* === Right Content Area === */}
          <main className="flex-1 space-y-6 lg:space-y-8">

            {/* Learning Stats */}
            <section className="bg-white border border-gray-200 p-4 sm:p-6 rounded-md shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                Learning Progress
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                
                <div className="bg-blue-50/50 p-3 sm:p-4 text-center rounded-md border border-blue-200">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    {profileData.enrolled_courses_count}
                  </p>
                  <p className="text-xs text-blue-800 uppercase tracking-wider font-medium">
                    Enrolled
                  </p>
                </div>
                
                <div className="bg-green-50/50 p-3 sm:p-4 text-center rounded-md border border-green-200">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                    {profileData.completed_courses_count}
                  </p>
                  <p className="text-xs text-green-800 uppercase tracking-wider font-medium">
                    Completed
                  </p>
                </div>
                
                <div className="bg-yellow-50/50 p-3 sm:p-4 text-center rounded-md border border-yellow-200">
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">
                    {profileData.certificates_count}
                  </p>
                  <p className="text-xs text-yellow-800 uppercase tracking-wider font-medium">
                    Certificates
                  </p>
                </div>

              </div>
            </section>
            
            {/* My Organizations */}
            <section className="bg-white border border-gray-200 p-6 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">My Organizations</h3>
              {memberships.length > 0 ? (
                 <ul className="space-y-4">
                    {memberships.map((membership) => (
                      <li key={membership.id} className="p-3 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center transition-shadow hover:shadow-inner">
                          <div>
                            <p className="font-medium text-gray-800 text-base">{membership.organization_name}</p>
                            <p className="text-xs text-gray-500 capitalize mt-1">Role: {membership.role}</p>
                          </div>
                      </li>
                    ))}
                 </ul>
              ) : (
                <EmptyPlaceholder message="You are not currently affiliated with any organizations." />
              )}
            </section>

            {/* Certificates */}
            <section className="bg-white border border-gray-200 p-6 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Certificates Earned</h3>
              {certificates.length > 0 ? (
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive grid for certificates */}
                    {certificates.map((cert) => (
                      <li key={cert.id} className="p-3 bg-white border border-gray-300 shadow-sm text-sm rounded-md hover:shadow-md transition-shadow">
                        <p className="font-medium text-gray-800">{cert.course_title}</p>
                        <p className="text-xs text-blue-600 mt-1">View Certificate</p>
                      </li>
                    ))}
                 </ul>
              ) : (
                <EmptyPlaceholder message="You have not earned any certificates yet. Keep learning!" />
              )}
            </section>

            {/* Account Settings */}
            <section className="bg-white border border-gray-200 p-6 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Account Settings</h3>
              <div className="space-y-4">
                
                {/* Change Password */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-200 gap-2">
                  <p className="text-gray-700 text-sm">Update your password for better security.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 transition whitespace-nowrap flex-shrink-0 rounded-md"
                  >
                    Change Password
                  </button>
                </div>

                {/* Learning Updates Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <p className="text-gray-700 text-sm">Receive learning updates via email.</p>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none border border-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600"></div>
                   </label>
                </div>

                {/* Sign Out */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-200 gap-2">
                  <p className="text-gray-700 text-sm">Sign out safely from this device.</p>
                  <button
                    onClick={handleSignOut}
                    disabled={signOutLoading}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 px-3 transition whitespace-nowrap disabled:opacity-50 flex-shrink-0 rounded-md"
                  >
                    {signOutLoading ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>

                {/* Delete Account */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-2">
                  <p className="text-gray-700 text-sm">Permanently remove your account and all data.</p>
                  <button className="bg-gray-400 hover:bg-gray-500 text-gray-900 text-xs font-medium py-2 px-3 transition whitespace-nowrap flex-shrink-0 rounded-md">
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}