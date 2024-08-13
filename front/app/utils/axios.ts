import axios from "axios";
import { getSession } from "next-auth/react"; // Importer getSession de next-auth

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Inclut les cookies de session si nécessaires
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // Récupérer la session utilisateur via NextAuth.js
    if (session) {
      // Si un token est présent dans la session, l'ajouter aux headers
      config.headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Erreur de réponse du serveur
      if (error.response.status === 401) {
        // Rediriger vers la page de connexion si non authentifié
        window.location.href = "/authentification/signin";
      }
      if (error.response.status >= 500) {
        console.error("Erreur serveur:", error.response.data);
      }
    } else if (error.request) {
      // Erreur de requête
      console.error("Aucune réponse reçue:", error.request);
    } else {
      // Autre erreur
      console.error("Erreur:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;