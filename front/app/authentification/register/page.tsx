"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../utils/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const response = await axios.post("/auth/register", { email, password });

      if (response.status === 201) {
        router.push("/authentification/signin");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center min-h-screen p-4 lg:justify-center">
      <div className="w-full max-w-md border-2 rounded-lg shadow-lg p-6">
        <form
          onSubmit={handleRegister}
          className="w-full mt-8 text-xl text-black font-semibold flex flex-col"
        >
          {error && (
            <span 
              className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md"
              role="alert" 
              aria-live="assertive" // accessibilité pour les utilisateurs de lecteurs d’écran
            >
              {error}
            </span>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
            aria-label="Email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
            aria-label="Password"
          />
          <button
            type="submit"
            className={`w-2/3 h-12 px-4 mt-4 text-lg text-white transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-blue-700 mx-auto ${
              isLoading ? "bg-gray-400" : "bg-blue-600"
            }`}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}