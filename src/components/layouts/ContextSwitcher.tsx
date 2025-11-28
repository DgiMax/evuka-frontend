"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { Check, ChevronsUpDown } from "lucide-react";

export default function OrganizationSwitcher() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { activeSlug, setActiveSlug } = useActiveOrg(); // ✅ Get setActiveSlug
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !user) {
    return null;
  }

  // Find the current org by its slug
  const currentOrg = user.organizations?.find(
    (org) => org.organization_slug === activeSlug
  );

  // Get the display name
  const currentDisplayName = currentOrg
    ? currentOrg.organization_name
    : "Personal Account";

  const handleSwitch = (slug: string | null) => {
    setIsOpen(false);
    if (slug === activeSlug) return;

    // ✅ CRITICAL FIX: Update context FIRST, then navigate
    console.log(`[OrgSwitcher] Switching from "${activeSlug}" to "${slug}"`);
    setActiveSlug(slug);

    // Small delay to ensure context updates before navigation
    setTimeout(() => {
      if (slug) {
        router.push(`/${slug}/dashboard`);
      } else {
        router.push("/dashboard");
      }
    }, 50);
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      {/* 1. The Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full min-w-[200px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
      >
        <span className="font-semibold truncate">{currentDisplayName}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* 2. The Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-1" role="menu" aria-orientation="vertical">
            {/* Personal Account Item */}
            <button
              onClick={() => handleSwitch(null)}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-gray-100"
            >
              <span className="flex-1 text-left">
                {user.username} (Personal)
              </span>
              {activeSlug === null && <Check className="ml-2 h-4 w-4" />}
            </button>

            <div className="my-1 h-px bg-gray-200" />

            {/* Organization Items */}
            {user.organizations && user.organizations.length > 0 && (
              <div className="text-xs text-gray-500 px-2 pt-1 pb-2 font-medium">
                Organizations
              </div>
            )}

            {user.organizations?.map((org) => (
              <button
                key={org.organization_slug}
                onClick={() => handleSwitch(org.organization_slug)}
                className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-gray-100"
              >
                <span className="flex-1 text-left">
                  {org.organization_name}
                </span>
                {activeSlug === org.organization_slug && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}