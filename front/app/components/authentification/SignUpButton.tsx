
"use client";

import { useRouter } from "next/navigation";

export function SignUpButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/authentification/register");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-8 px-6 mt-4 text-lg text-white transition-colors duration-150 bg-green-600 rounded-lg focus:shadow-outline hover:bg-green-700"
    >
      Sign Up
    </button>
  );
}
