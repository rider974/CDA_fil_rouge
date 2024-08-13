"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

// Définir le type exact de role_name pour éviter les erreurs de typage
interface Role {
  role_name: string;
}

interface CustomUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: Role;
}

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link href="/">Home</Link>
        </li>
        {session?.user && (session.user as CustomUser).role ? (
          <>
            {(session.user as CustomUser).role.role_name === "admin" && (
              <li>
                <Link href="/dashboard/admin">Admin Dashboard</Link>
              </li>
            )}
            {(session.user as CustomUser).role.role_name === "member" && (
              <li>
                <Link href="/dashboard/member">Member Dashboard</Link>
              </li>
            )}
            {(session.user as CustomUser).role.role_name === "moderator" && (
              <li>
                <Link href="/dashboard/moderator">Moderator Dashboard</Link>
              </li>
            )}
          </>
        ) : (
          <li>
            <Link href="/authentification/signin">Sign In</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}