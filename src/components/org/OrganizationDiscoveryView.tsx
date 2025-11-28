// views/OrganizationDiscoveryView.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/axios";
import { Loader2, Search, Inbox, Building2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { debounce } from "lodash";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Constants ---
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

// --- Interfaces ---
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

// --- Components ---

// Standardized Empty State
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg bg-muted/50 p-4 max-w-lg mx-auto">
    <Inbox className="h-8 w-8 text-muted-foreground" />
    <p className="text-muted-foreground mt-2 text-center text-sm">{message}</p>
  </div>
);

export default function OrganizationDiscoveryView() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // State
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

  // Helper: Build Query String
  const buildQueryString = useCallback((currentFilters: FiltersState): string => {
    const params = new URLSearchParams();
    if (currentFilters.search) params.append("search", currentFilters.search);
    if (currentFilters.org_type) params.append("org_type", currentFilters.org_type);
    if (currentFilters.membership_period) params.append("membership_period", currentFilters.membership_period);
    return params.toString();
  }, []);

  // API Fetch Function
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

  // Debounced Fetch for Search
  const debouncedGetFilteredOrganizations = useCallback(
    debounce((currentFilters: FiltersState) => {
      getFilteredOrganizations(currentFilters);
    }, 500),
    [getFilteredOrganizations]
  );

  // Initial Load Effect (Runs once on mount)
  useEffect(() => {
    getFilteredOrganizations(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Filter Change Handler
  const handleFilterChange = useCallback(
    (newFilters: Partial<FiltersState>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      // Debounce search, but fetch immediate for dropdowns
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
    <div className="container mx-auto py-12 px-4 max-w-7xl">

      {/* Header Section */}
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

      {/* Filters Section */}
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

      {/* Organization List Grid */}
      {showLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Finding organizations...</p>
        </div>
      ) : organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {organizations.map((org) => (
            <div
              key={org.slug}
              className="group flex flex-col justify-between border border-border rounded-md bg-card hover:border-primary/50 transition-all duration-200 cursor-pointer h-full overflow-hidden"
              onClick={() => handleViewProfile(org.slug)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center text-primary shrink-0">
                             <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                             <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                {org.name}
                             </h3>
                             <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold text-muted-foreground border-border px-1.5 py-0">
                                {org.org_type}
                             </Badge>
                        </div>
                    </div>
                </div>

                <div className="mb-6 min-h-[4.5rem]">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {org.description || "No description provided for this organization."}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-sm font-semibold text-foreground">
                        {formatPrice(org.membership_price, org.membership_period)}
                    </span>
                    {org.is_member && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 gap-1 rounded-sm px-2">
                            <CheckCircle2 className="w-3 h-3" /> Member
                        </Badge>
                    )}
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnrollmentClick(org);
                  }}
                  disabled={org.is_member}
                  className={cn(
                      "w-full rounded-md font-medium shadow-none h-11",
                      org.is_member 
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-default" 
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
  );
}