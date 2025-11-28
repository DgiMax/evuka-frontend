import Link from "next/link";

const pricingPlans = [
  {
    type: "Individual",
    price: "$5.00",
    period: "per month",
    description: "Learn at your own pace with full access to courses and events.",
    tagline: "Best for students & self-learners",
    buttonText: "Get Started",
    buttonHref: "/signup?plan=individual",
  },
  {
    type: "Family",
    price: "$12.00",
    period: "per month",
    description: "Empower your household with up to 4 learner profiles.",
    tagline: "Best for homeschooling & parents",
    buttonText: "Start Family Plan",
    buttonHref: "/signup?plan=family",
  },
  {
    type: "Institution",
    price: "Custom",
    period: "",
    description: "Tailored solutions for schools, cultural centers, and organizations.",
    tagline: "Best for classrooms & communities",
    buttonText: "Contact Us",
    buttonHref: "/contact?plan=institution",
  },
];

interface PricingCardProps {
  plan: typeof pricingPlans[0];
}

function PricingCard({ plan }: PricingCardProps) {
  const isCustom = plan.type === "Institution";

  return (
    <div
      className={`bg-card p-8 sm:p-10 rounded border border-border flex flex-col items-center text-center transition-all duration-300 ${
        plan.type === "Family"
          ? "scale-[1.08] shadow-sm z-10 rounded-md"
          : "scale-100 shadow"
      }`}
    >
      <h3 className="text-xl font-bold text-card-foreground mb-2">{plan.type}</h3>

      <div className="mb-4">
        {isCustom ? (
          <p className="text-6xl font-extrabold text-primary">{plan.price}</p>
        ) : (
          <p className="text-5xl font-extrabold text-primary leading-none">{plan.price}</p>
        )}
        <p className="text-sm font-medium text-muted-foreground mt-1">{plan.period}</p>
      </div>

      <p className="text-base text-muted-foreground mb-4 max-w-xs">{plan.description}</p>

      <p className="text-sm font-semibold text-card-foreground/80 italic mt-auto mb-6">
        {plan.tagline}
      </p>

      <Link
        href={plan.buttonHref}
        className="bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded hover:opacity-90 transition duration-200 w-full"
      >
        {plan.buttonText}
      </Link>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8 !leading-tight">
          Flexible Plans for Every Learner
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.type} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
