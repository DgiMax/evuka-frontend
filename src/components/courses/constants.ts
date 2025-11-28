import { Info, BookOpen, FileImage, DollarSign } from "lucide-react";

export const DUMMY_DATA = {
  organizations: [
    { id: "org1", name: "Creative Minds Academy" },
    { id: "org2", name: "Tech Innovators Hub" },
  ],
  globalCategories: [
    { id: "cat1", name: "Web Development" },
    { id: "cat2", name: "Data Science" },
    { id: "cat3", name: "Design" },
  ],
  globalLevels: [
    { id: "lvl1", name: "Beginner" },
    { id: "lvl2", name: "Intermediate" },
    { id: "lvl3", name: "Advanced" },
  ],
  orgCategories: {
    org1: [
      { id: "orgcat1", name: "Frontend" },
      { id: "orgcat2", name: "Backend" },
    ],
    org2: [
      { id: "orgcat3", name: "Machine Learning" },
      { id: "orgcat4", name: "AI Ethics" },
    ],
  },
  orgLevels: {
    org1: [
      { id: "orglvl1", name: "Level 1" },
      { id: "orglvl2", name: "Level 2" },
    ],
    org2: [
      { id: "orglvl3", name: "Introductory" },
      { id: "orglvl4", name: "Expert" },
    ],
  },
};

export const steps = [
  { id: 1, name: "Basic Info", icon: Info, fields: ["title", "short_description", "long_description", "learning_objectives", "global_category", "global_level", "organization", "org_category", "org_level"] as const },
  { id: 2, name: "Curriculum", icon: BookOpen, fields: ["modules"] as const },
  { id: 3, name: "Media & Resources", icon: FileImage, fields: ["thumbnail", "promo_video"] as const },
  { id: 4, name: "Pricing & Publish", icon: DollarSign, fields: ["price", "is_published"] as const },
];
