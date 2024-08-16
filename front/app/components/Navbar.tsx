"use client";
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

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/authentification/signin">Sign In</Link>
        </li>
      </ul>
    </nav>
  );
}