"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link href="/">Home</Link>
        </li>
        {session?.user ? (
          <>
            {session.user.role === "admin" && (
              <li>
                <Link href="/dashboard/admin">Admin Dashboard</Link>
              </li>
            )}
            {session.user.role === "member" && (
              <li>
                <Link href="/dashboard/member">Member Dashboard</Link>
              </li>
            )}
            {session.user.role === "moderator" && (
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