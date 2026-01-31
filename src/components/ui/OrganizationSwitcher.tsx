"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Search, Lock } from "lucide-react";

const PERSONAL_ACCOUNT_VALUE = "__personal__";
const STUDENT_DOMAIN = process.env.NEXT_PUBLIC_STUDENT_URL || "https://e-vuka.com";
const TUTOR_DOMAIN = process.env.NEXT_PUBLIC_TUTOR_URL || "https://tutors.e-vuka.com";

export default function OrganizationSwitcher({ triggerClassName, fullWidth, height }: any) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { activeSlug, setActiveSlug } = useActiveOrg();

  if (loading || !user) return null;
  const organizations = user.organizations ?? [];
  const selectedValue = activeSlug ?? PERSONAL_ACCOUNT_VALUE;

  const handleSelectChange = (value: string) => {
    if (value === selectedValue) return;

    if (value === PERSONAL_ACCOUNT_VALUE) {
      setActiveSlug(null);
      router.push("/dashboard");
      return;
    }

    const targetOrg = organizations.find((org) => org.organization_slug === value);
    if (!targetOrg || targetOrg.organization_status !== "approved") return;

    setActiveSlug(targetOrg.organization_slug);
    const targetBaseUrl = targetOrg.role === "student" ? STUDENT_DOMAIN : TUTOR_DOMAIN;
    const currentOrigin = window.location.origin.replace(/\/$/, "");
    const normalizedBase = targetBaseUrl.replace(/\/$/, "");

    if (currentOrigin === normalizedBase) {
      router.push(`/${value}/dashboard`);
    } else {
      window.location.href = `${normalizedBase}/${value}/dashboard`;
    }
  };

  return (
    <Select key={activeSlug ?? "personal"} value={selectedValue} onValueChange={handleSelectChange}>
      <SelectTrigger className={cn("justify-between truncate shadow-none", fullWidth && "w-full", height || "h-10", triggerClassName)}>
        <SelectValue placeholder="Select account..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={PERSONAL_ACCOUNT_VALUE}>{user.username} (Personal)</SelectItem>
        </SelectGroup>
        {organizations.length > 0 && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Organizations</SelectLabel>
              {organizations.map((org) => {
                const isLocked = org.organization_status !== "approved";
                return (
                  <SelectItem key={org.organization_slug} value={org.organization_slug} disabled={isLocked}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="flex items-center gap-2">
                        {org.organization_name}
                        {isLocked && <Lock className="h-3 w-3 opacity-50" />}
                      </span>
                      <span className="text-[10px] border px-1 rounded uppercase">{org.role === 'student' ? 'STU' : 'TUT'}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </>
        )}
        <SelectSeparator />
        <Link href="/organizations/browse/" className="flex items-center p-2 text-sm hover:bg-accent rounded-sm">
          <Search className="mr-2 h-4 w-4" /> Browse Organizations
        </Link>
      </SelectContent>
    </Select>
  );
}