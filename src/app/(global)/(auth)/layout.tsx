import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#EFFAFC" }}
    >
      <div className="flex-1 w-full flex flex-col items-center justify-start pt-12 sm:pt-20 pb-10 px-4">
        {children}
      </div>

      <div className="w-full p-6">
        <Link
          href="/"
          className="inline-block px-5 py-2.5 text-sm font-medium rounded-md text-white bg-secondary border border-gray-300 shadow-sm hover:opacity-90 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}