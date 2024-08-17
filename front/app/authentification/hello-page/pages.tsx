"use client";

import { useState, useEffect } from "react";

export default function HelloPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    // Simuler la vérification de l'authentification
    const simulateAuthCheck = () => {
      setTimeout(() => {
        const fakeUser = { name: "John Doe", email: "john.doe@example.com" };
        setUser(fakeUser);
        setIsAuthenticated(true);
        setIsLoading(false);
      }, 1000); 
    };

    simulateAuthCheck();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>; 
  }

  if (!isAuthenticated) {
    return <p>Accès refusé. Vous devez être authentifié pour voir cette page</p>; 
  }

  return (
    <div className="w-full flex items-center min-h-screen p-4 lg:justify-center">
      <div className="w-full max-w-md border-2 rounded-lg shadow-lg p-6">
        <h1 className="text-lime-200 text-lg">
          Hello, {user?.name || user?.email}! Welcome to the protected page!
        </h1>
      </div>
    </div>
  );
}