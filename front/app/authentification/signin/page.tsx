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

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("/api/auth/csrf-token");
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        setError("");
      }
    };
    fetchCsrfToken();
  }, []);

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
