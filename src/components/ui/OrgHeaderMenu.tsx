"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Home,
  BookOpen,
  Bell,
  Users,
  Search,
  User as UserIcon,
} from "lucide-react";
import OrganizationSwitcher from "@/components/ui/OrganizationSwitcher";

export function HeaderMenu() {
  const { user, logout } = useAuth();
  const { activeSlug } = useActiveOrg(); // ❗ Removed activeOrg to prevent TS error
  const router = useRouter();
  const [signOutLoading, setSignOutLoading] = useState(false);

  // -------------------------------------------------
  // 🔹 Derived organization name (SAFE, no activeOrg)
  // -------------------------------------------------
  const orgName = useMemo(() => {
    if (!activeSlug) return "Organization Portal";
    return activeSlug.replace(/-/g, " ").toUpperCase();
  }, [activeSlug]);

  // -------------------------------------------------
  // 🔹 Base path (reuse everywhere)
  // -------------------------------------------------
  const basePath = activeSlug ? `/org/${activeSlug}` : `/dashboard`;

  // -------------------------------------------------
  // 🔹 Organization contextual links
  // -------------------------------------------------
  const orgLinks = useMemo(
    () => [
      { name: "Org Dashboard", href: `${basePath}`, icon: Home },
      { name: "Announcements", href: `${basePath}/announcements`, icon: Bell },
      { name: "Tutors & Team", href: `${basePath}/team`, icon: Users },
    ],
    [basePath]
  );

  // -------------------------------------------------
  // 🔹 Logout action
  // -------------------------------------------------
  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setSignOutLoading(false);
    }
  };

  // -------------------------------------------------
  // 🔹 Display dropdown label
  // -------------------------------------------------
  const menuLabel = activeSlug ? orgName : "My Account";

  return (
    <div className="hidden md:flex items-center space-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="font-medium flex items-center gap-1 whitespace-nowrap"
            disabled={signOutLoading}
          >
            Account
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* 🔹 Organization Sections (only when activeSlug exists) */}
          {activeSlug && (
            <>
              {orgLinks.map(({ name, href, icon: Icon }) => (
                <DropdownMenuItem key={name} asChild>
                  <Link href={href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {name}
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
            </>
          )}


          {/* 🔹 Organization Switcher */}
          <div className="px-2 py-1.5">
            <OrganizationSwitcher triggerClassName="w-full justify-between" />
          </div>

          <DropdownMenuSeparator />

          {/* 🔹 Logout */}
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={signOutLoading}
            className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/30 cursor-pointer"
          >
            {signOutLoading ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
