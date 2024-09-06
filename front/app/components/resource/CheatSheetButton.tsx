import Link from "next/link";
import React from "react";

export function CheatSheetButton() {
  return (
    <Link
      href="/resources/cheatsheet"
      aria-label="CHEAT SHEET" className="bg-transparent text-white font-normal w-32 h-10 border-2 border-white flex items-center justify-center rounded hover:bg-white hover:text-gray-900 transition duration-200 ml-8"
    >
      CHEAT SHEET
    </Link>
  );
}