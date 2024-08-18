"use client";

import Link from "next/link";
import { FaHome, FaSignInAlt } from "react-icons/fa";

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
    <nav className="bg-gray-800 p-4 h-16 shadow-sm flex items-center">
      <ul className="flex space-x-4 text-white">
        <li className="flex items-center">
          <FaHome className="h-5 w-5" />
          <Link href="/" className="ml-2 hover:underline">
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <FaSignInAlt className="h-5 w-5" />
          <Link
            href="/authentification/signin"
            className="ml-2 hover:underline"
          >
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}
