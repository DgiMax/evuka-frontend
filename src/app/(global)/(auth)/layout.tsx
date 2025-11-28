import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen pt-8"
      style={{ backgroundColor: "#EFFAFC" }}
    >
      <Link
        href="/"
        className="absolute bottom-6 left-6 px-4 py-2 font-medium rounded text-white border bg-secondary border-gray-300 hover:opacity-90 transition"
      >
        ← Back to Home
      </Link>

      {children}

    </div>
  );
}
