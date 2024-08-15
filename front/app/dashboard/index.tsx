"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { User } from "next-auth"; 

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as User; 
      
      // Vérifiez que le rôle existe avant d'accéder à role_name
      const roleName = user?.role?.role_name;

      switch (roleName) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "member":
          router.push("/dashboard/member");
          break;
        case "moderator":
          router.push("/dashboard/moderator");
          break;
        default:
          router.push("/dashboard"); 
      }
    } else if (status === "unauthenticated") {
      router.push("/authentification/signin");
    }
  }, [status, session, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <p className="mt-10 mb-4 text-4xl font-bold">Hello...</p>
    </div>
  );
}