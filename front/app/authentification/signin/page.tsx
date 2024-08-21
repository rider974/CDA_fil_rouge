"use client";

import { CredentialsForm } from "@/app/components/authentification/CredentialForm";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = Cookies.get("authToken") || '';

        if (token) {
          const decodedToken: any = jwtDecode(token);

          // Extract the role name
          const userRole = decodedToken.role?.role_name || '';
          if (userRole === "admin") {
            router.push("/dashboard/admin");
          } else if (userRole === "moderator") {
            router.push("/dashboard/moderator");
          } else {
            router.push("/dashboard/member");
          }
        } else {
          setError("JWT token not found in cookies.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An unexpected error occurred: ");
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
      />
    </div>
  );
}