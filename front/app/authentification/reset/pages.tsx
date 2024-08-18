"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ResetPasswordForm } from "@/app/components/authentification/ResetPasswordForm";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("/api/auth/csrf-token");
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to load CSRF token.");
      }
    };
    fetchCsrfToken();
  }, []);

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("/api/auth/reset", {
        email,
        csrfToken,
      });

      if (response.status === 200) {
        setSuccessMessage(
          "Un lien de réinitialisation a été envoyé à votre adresse email."
        );
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }

    return (
      <ResetPasswordForm
        onSubmit={handleResetPassword}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
      />
    );
  };
}
