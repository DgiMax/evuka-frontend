'use client';

import { useEffect } from 'react';
import { useActiveOrg } from '@/lib/hooks/useActiveOrg';

interface OrgContextUpdaterProps {
  slug: string | null;
}

export default function OrgContextUpdater({ slug }: OrgContextUpdaterProps) {
  const { activeSlug, setActiveSlug } = useActiveOrg();

  useEffect(() => {
    // Only update if the slug actually changed
    if (activeSlug !== slug) {
      console.log('[OrgContextUpdater] Updating context from URL:', {
        from: activeSlug,
        to: slug,
      });
      setActiveSlug(slug);
    }
  }, [slug, activeSlug, setActiveSlug]);

  return null;
}