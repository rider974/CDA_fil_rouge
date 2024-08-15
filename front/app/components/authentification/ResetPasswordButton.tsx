"use client";

import { useRouter } from "next/navigation";
import React from "react";

export function ResetPasswordButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/authentification/reset-password");
  };

  return (
    <button
      onClick={handleClick}
      className="text-left inline-block text-sm text-red-600 "
    >
      Mot de passe oublié 🤨
    </button>
  );
}