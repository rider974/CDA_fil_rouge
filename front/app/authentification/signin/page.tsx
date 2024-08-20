"use client";

import { CredentialsForm } from "@/app/components/authentification/CredentialForm";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Correction de l'orthographe

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("/api/auth/csrf-token");
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error); 
        setError("An error occurred. Please try again later.");
      }
    };

    const checkAuthentication = async () => {
      try {
        const response = await axios.get("/api/auth/session");
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAuthenticated(true);
          router.push("/dashboard/member"); // Rediriger les utilisateurs connectés vers la page membre
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchCsrfToken();
    checkAuthentication();
  }, [router]); // Correction : la dépendance à `router` doit être dans le tableau de dépendances

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
        csrfToken,
      });

      if (response.status === 200) {
        router.push("/dashboard/member");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Optionnel : Vous pouvez retourner null ou un loader si vous attendez une redirection
  }

  return (
    <div>
      <CredentialsForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        csrfToken={csrfToken}
      />
    </div>
  );
}