"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/axios";
import { Search, Inbox, Building2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { debounce } from "lodash";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ORG_TYPE_OPTIONS = [
  { value: "school", label: "School" },
  { value: "homeschool", label: "Homeschool Network" },
];

const MEMBERSHIP_PERIOD_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
  { value: "free", label: "Free Access" },
];

interface OrganizationListItem {
  slug: string;
  name: string;
  org_type: string;
  description: string;
  membership_price: number;
  membership_period: string;
  is_member: boolean;
}

interface FiltersState {
  search: string;
  org_type: string;
  membership_period: string;
}

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg bg-muted/50 p-4 max-w-lg mx-auto">
    <Inbox className="h-8 w-8 text-muted-foreground" />
    <p className="text-muted-foreground mt-2 text-center text-sm">{message}</p>
  </div>
);

const OrganizationCardSkeleton = () => (
  <div className="flex flex-col h-full bg-card border border-border rounded-md overflow-hidden">
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton width={48} height={48} className="rounded-md shrink-0" />
        <div className="flex-1 pt-0.5">
          <Skeleton width="70%" height={24} className="mb-2" />
          <Skeleton width={60} height={16} />
        </div>
      </div>
      <div className="flex-grow mb-6">
        <Skeleton count={3} />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
        <Skeleton width={100} height={20} />
      </div>
    </div>
    <div className="p-5 pt-0">
      <Skeleton height={40} className="rounded-md" />
    </div>
  </div>
);

export default function OrganizationDiscoveryView() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [organizations, setOrganizations] = useState<OrganizationListItem[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    org_type: "",
    membership_period: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const buildQueryString = useCallback((currentFilters: FiltersState): string => {
    const params = new URLSearchParams();
    if (currentFilters.search) params.append("search", currentFilters.search);
    if (currentFilters.org_type) params.append("org_type", currentFilters.org_type);
    if (currentFilters.membership_period) params.append("membership_period", currentFilters.membership_period);
    return params.toString();
  }, []);

  const getFilteredOrganizations = useCallback(async (currentFilters: FiltersState) => {
    setIsFiltering(true);
    setStatus(null);

    try {
      const queryString = buildQueryString(currentFilters);
      const response = await api.get(`/organizations/?${queryString}`);

      const organizationsArray = Array.isArray(response.data)
        ? response.data
        : response.data.results;

      setOrganizations(organizationsArray || []);
    } catch (err) {
      console.error("Failed to fetch filtered organizations:", err);
      setStatus({ type: "error", message: "Failed to apply filters." });
      setOrganizations([]);
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  }, [buildQueryString]);

  const debouncedGetFilteredOrganizations = useCallback(
    debounce((currentFilters: FiltersState) => {
      getFilteredOrganizations(currentFilters);
    }, 500),
    [getFilteredOrganizations]
  );

  useEffect(() => {
    getFilteredOrganizations(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Partial<FiltersState>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      if (newFilters.search !== undefined) {
        debouncedGetFilteredOrganizations(updatedFilters);
      } else {
        getFilteredOrganizations(updatedFilters);
      }
    },
    [filters, debouncedGetFilteredOrganizations, getFilteredOrganizations]
  );

  const handleEnrollmentClick = (org: OrganizationListItem) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    router.push(`/enroll/${org.slug}`);
  };

  const handleViewProfile = (slug: string) => {
    router.push(`/organizations/browse/${slug}`);
  };

  const formatPrice = (price: number, period: string) => {
    if (price === 0) return "Free Access";
    return `KES ${price.toLocaleString()} / ${period.charAt(0).toUpperCase() + period.slice(1)}`;
  };

  const showLoading = isLoading || (isFiltering && organizations.length === 0);

  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="container mx-auto py-12 px-4 max-w-7xl">

        <div className="flex flex-col items-center mb-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Discover Organizations
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Find schools and homeschool networks that match your learning goals.
          </p>
        </div>

        {status && (
          <Alert variant={status.type === "error" ? "destructive" : "default"} className="mb-6 max-w-4xl mx-auto">
            <AlertTitle>{status.type === "error" ? "Error" : "Notification"}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <div className="bg-card border border-border rounded-md p-4 mb-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search organizations..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="pl-10 bg-background border-border focus-visible:ring-1 focus-visible:ring-primary h-10"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Select
              value={filters.org_type || "all"}
              onValueChange={(value) =>
                handleFilterChange({ org_type: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-full md:w-48 bg-background h-10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ORG_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.membership_period || "all"}
              onValueChange={(value) =>
                handleFilterChange({ membership_period: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-full md:w-48 bg-background h-10">
                <SelectValue placeholder="All Periods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                {MEMBERSHIP_PERIOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
 
        {showLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <OrganizationCardSkeleton key={i} />
            ))}
          </div>
        ) : organizations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {organizations.map((org) => (
              <div
                key={org.slug}
                className="group flex flex-col h-full bg-card border border-border rounded-md hover:border-primary/50 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden"
                onClick={() => handleViewProfile(org.slug)}
              >
                <div className="p-5 flex flex-col flex-grow">
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-md bg-secondary/10 flex items-center justify-center text-primary shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors truncate">
                        {org.name}
                      </h3>
                      <Badge variant="outline" className="mt-1.5 text-[10px] uppercase font-bold text-muted-foreground border-border px-1.5 py-0.5">
                        {org.org_type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-grow mb-6">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {org.description || "No description provided for this organization."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                    <span className="text-sm font-semibold text-foreground">
                      {formatPrice(org.membership_price, org.membership_period)}
                    </span>
                    {org.is_member && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 gap-1 rounded-sm px-2 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Member
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnrollmentClick(org);
                    }}
                    disabled={org.is_member}
                    className={cn(
                      "w-full rounded-md font-medium shadow-none h-10 transition-colors",
                      org.is_member
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 opacity-100 cursor-default"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {!isAuthenticated
                      ? "Login to Join"
                      : org.is_member
                      ? "Already a Member"
                      : "Enroll Now"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No organizations found matching your criteria." />
        )}
      </div>
    </SkeletonTheme>
  );
}