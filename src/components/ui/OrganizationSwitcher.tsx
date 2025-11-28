"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils"; 
import Link from 'next/link';
import { Search } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERSONAL_ACCOUNT_VALUE = "__personal__";

interface OrganizationSwitcherProps {
  triggerClassName?: string;
}

export default function OrganizationSwitcher({ triggerClassName }: OrganizationSwitcherProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { activeSlug } = useActiveOrg();

  if (loading || !user) {
    return null;
  }

  const selectedValue = activeSlug === null ? PERSONAL_ACCOUNT_VALUE : activeSlug;

  const handleSelectChange = (value: string) => {
    if (value === selectedValue) return;

    if (value === PERSONAL_ACCOUNT_VALUE) {
      router.push("/dashboard");
    } else {
      router.push(`/${value}/dashboard`);
    }
  };

  return (
    <Select value={selectedValue} onValueChange={handleSelectChange}>
      <SelectTrigger
        className={cn(
          "w-full min-w-[200px] sm:w-auto justify-between border-gray-300",
          triggerClassName
        )}
        aria-label="Select account or organization"
      >
        <SelectValue placeholder="Select account..." />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value={PERSONAL_ACCOUNT_VALUE}>
            {user.username} (Personal)
          </SelectItem>
        </SelectGroup>

        {user.organizations && user.organizations.length > 0 && (
          <SelectSeparator />
        )}

        {user.organizations && user.organizations.length > 0 && (
          <SelectGroup>
            <SelectLabel>Organizations</SelectLabel>
            {user.organizations.map((org) => (
              <SelectItem
                key={org.organization_slug}
                value={org.organization_slug}
              >
                {org.organization_name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        <SelectSeparator />

        <Link
          href="/organizations/browse"
          className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-sm mx-1 cursor-pointer transition-colors"
          onMouseDown={(e) => { 
            e.preventDefault(); 
            router.push("/organizations/browse"); 
          }}
        >
          <Search className="w-4 h-4" />
          <span>Browse Organizations</span>
        </Link>
      </SelectContent>
    </Select>
  );
}
