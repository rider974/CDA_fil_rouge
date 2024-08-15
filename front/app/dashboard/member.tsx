"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const userRole = session?.user?.role?.role_name;
  
  if (status === "unauthenticated" || userRole == "member") {
    router.push("/authentification/signin");
    return null;
  }
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-green-500 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Bienvenue sur votre dashboard membre</h1>
        </div>
      </div>
    );
  }