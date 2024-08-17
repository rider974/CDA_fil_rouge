"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../utils/axios";
import { RegisterForm } from "@/app/components/authentification/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        router.push(
          "/authentification/signin?message=Inscription réussie. Veuillez vous connecter."
        );
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    } catch (err) {
      setError("L'enregistrement a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
