// app/organizations/browse/[slug]/page.tsx

import OrgBrowseProfileClient from "@/components/org/OrgBrowseProfileClient";

interface BrowseOrgProfilePageProps {
    // Next.js automatically creates the 'params' object based on the folder structure [slug]
    params: {
        slug: string; 
    };
}

export default function BrowseOrgProfilePage({ params }: BrowseOrgProfilePageProps) {
    // 💡 The slug is extracted from the URL parameters provided by Next.js routing
    const orgSlug = params.slug;

    // The component is rendered and the slug is passed as a required prop.
    return <OrgBrowseProfileClient orgSlug={orgSlug} />;
}