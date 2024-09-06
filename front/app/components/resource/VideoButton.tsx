import Link from "next/link";
import React from "react";

export function VideoButton() {
  return (
    <Link
      href="/resources/video"
      aria-label="VIDEO" className="bg-transparent text-white font-normal w-16 h-10 border-2 border-white flex items-center justify-center rounded hover:bg-white hover:text-gray-900 transition duration-200 ml-8"
    >
      VIDEO
    </Link>
  );
}