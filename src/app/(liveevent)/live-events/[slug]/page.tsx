"use client";

import React from 'react';
import EvukaLivePlayer from "@/components/courses/EvukaLivePlayer";
import { useRouter } from 'next/navigation';

export default function LiveEventParticipantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950">
      <EvukaLivePlayer 
        idOrSlug={slug} 
        type="event"
        onExit={() => router.push("/registered-events")}
      />
    </div>
  );
}