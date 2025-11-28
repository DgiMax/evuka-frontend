// app/courses/error.tsx
"use client";

import Image from "next/image";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="max-w-md w-full bg-white rounded p-8 text-center border border-gray-100">
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src="/failed.svg"
            alt="Error illustration"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-500 mb-6">
          {error?.message ||
            "We couldn’t load the courses right now. Please try again later."}
        </p>

        {/* Retry Button */}
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded 
                     bg-primary text-white font-medium shadow-sm hover:bg-primary/90 
                     transition-colors duration-200"
        >
          <RefreshCcw size={18} />
          Try again
        </button>
      </div>
    </div>
  );
}
