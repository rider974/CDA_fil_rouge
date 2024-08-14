"use client";

import { useSession } from "next-auth/react";

export default function HelloPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>; // Afficher un indicateur de chargement pendant que la session est récupérée
  }

  if (!session) {
    return <p>Accès refusé. Vous devez être authentifié pour voir cette page</p>; // Gérer l'accès refusé
  }

  return (
    <div className="w-full flex items-center min-h-screen p-4 lg:justify-center">
      <div className="w-full max-w-md border-2 rounded-lg shadow-lg p-6">
        <h1 className="text-lime-200 text-lg">
          Hello, {session.user?.name || session.user?.email}! Welcome to the protected page!
        </h1>
      </div>
    </div>
  );
}