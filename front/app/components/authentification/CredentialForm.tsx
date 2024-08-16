"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResetPasswordButton } from "./ResetPasswordButton";

interface CredentialsFormProps {
  csrfToken?: string;
}

export function CredentialsForm(props: CredentialsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    setIsLoading(true);
    setError(null);

    try {
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      // Simule la validation de l'utilisateur
      const isValidUser = email === "test@example.com" && password === "password123";

      if (isValidUser) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Fin du chargement dans tous les cas
    }
  };

  return (
    <form
      className="w-full mt-8 text-xl text-black font-semibold flex flex-col"
      onSubmit={handleSubmit}
    >
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
          {error}
        </span>
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
      />
      <ResetPasswordButton />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
      />

      <button
        type="submit"
        className="w-2/3 h-12 px-4 mt-4 text-lg text-white transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-blue-700 mx-auto"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}