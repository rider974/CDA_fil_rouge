"use client";

import React from "react";
import {
  GoogleSignInButton,
  GithubSignInButton,
} from "@/app/components/SignInButtons"; 
import { SignUpButton } from "@/app/components/SignUpButton";
import { CredentialsForm } from "@/app/components/CredentialForm";

export default function SignInPage() {
  return (
    <div className="w-full flex items-center min-h-screen p-4 lg:justify-center">
      <div className="w-full max-w-md border-2 rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center p-6 shadow-md">
          <h1 className="text-4xl text-gray-400 font-bold">Sign In</h1>
          
          {/* Boutons pour se connecter via Google et GitHub */}
          <GoogleSignInButton />
          <GithubSignInButton />
          
          <span className="text-2xl text-gray-400 font-semibold text-center mt-8">
            Or
          </span>

          {/* Formulaire d'identifiants */}
          <CredentialsForm />

          <div className="w-full mt-2 block justify-between">
            {/* Bouton pour rediriger vers l'inscription */}
            <SignUpButton />
          </div>
        </div>
      </div>
    </div>
  );
}
