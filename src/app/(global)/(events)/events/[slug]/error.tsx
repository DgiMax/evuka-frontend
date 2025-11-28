"use client";

import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8 text-center border border-gray-100 shadow-sm">
        <div className="flex justify-center mb-6">
          <Image
            src="/failed.svg"
            alt="Error illustration"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Event Not Found
        </h2>

        <p className="text-gray-500 mb-6">
          {error?.message ||
            "We couldn't load the event details. It might have been cancelled, removed, or the link is incorrect."}
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md
                     bg-[#2694C6] text-white font-medium shadow-sm hover:bg-[#1f7ba5] 
                     transition-colors duration-200"
        >
          <RefreshCcw size={18} />
          Reload Event
        </button>
      </div>
    </div>
  );
}