// app/enroll/initiate/[slug]/page.tsx

import EnrollClient from "@/components/org/EnrollClient";

interface EnrollPageProps {
    params: {
        slug: string; 
    };
}

export default function EnrollPage({ params }: EnrollPageProps) {
    // Pass the extracted slug from params to the client component.
    return <EnrollClient orgSlug={params.slug} />;
}