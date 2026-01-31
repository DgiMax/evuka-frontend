"use client";

import { useEffect } from "react";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { RESERVED_SLUGS } from "@/lib/constants";

interface OrgContextUpdaterProps {
  slug: string | null;
}

export default function OrgContextUpdater({ slug }: OrgContextUpdaterProps) {
  const { activeSlug, setActiveSlug } = useActiveOrg();

  useEffect(() => {
    const validatedSlug = RESERVED_SLUGS.includes(slug || "") ? null : slug;

    if (activeSlug !== validatedSlug) {
      setActiveSlug(validatedSlug);
    }
  }, [slug, activeSlug, setActiveSlug]);

  return null;
}