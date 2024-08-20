"use client";

import Link from "next/link";
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagButton } from "./resource/TagButton";
import { PdfButton } from "./resource/PdfButton";
import { CheatSheetButton } from "./resource/CheatSheetButton";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <FaHome className="h-5 w-5 text-white" />
        <Link href="/" className="ml-2 text-white hover:underline">
          Home
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4 text-white">
        <form onSubmit={handleSearch} className="flex items-center w-auto">
          <input
            type="text"
            className="px-3 py-1 rounded-lg text-gray-800"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="ml-2 text-white hover:underline">
            <FaSearch />
          </button>
        </form>
        <TagButton />
        <PdfButton />
        <CheatSheetButton />
      </div>

      <div className="hidden md:flex space-x-4 text-white">
        <div className="flex items-center">
          <FaUserPlus className="h-5 w-5" />
          <Link
            href="/authentification/register"
            className="ml-2 hover:underline"
          >
            Sign Up
          </Link>
        </div>
        <div className="flex items-center">
          <FaSignInAlt className="h-5 w-5" />
          <Link
            href="/authentification/signin"
            className="ml-2 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-white">
          {isMobileMenuOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-12 left-0 w-full bg-gray-800 text-white flex flex-col py-4 z-50">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full px-4"
          >
            <input
              type="text"
              className="px-3 py-1 rounded-lg text-gray-800 w-full"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="ml-2 text-white hover:underline">
              <FaSearch />
            </button>
          </form>
          <div className="flex flex-col space-y-4 items-start w-full px-4 mt-4">
            <TagButton />
            <PdfButton />
            <CheatSheetButton />
          </div>

          <div className="flex flex-col items-start space-y-4 px-4 mt-4">
            <Link
              href="/authentification/register"
              className="flex items-center hover:underline"
            >
              <FaUserPlus className="h-5 w-5" />
              <span className="ml-2">Sign Up</span>
            </Link>
            <Link
              href="/authentification/signin"
              className="flex items-center hover:underline"
            >
              <FaSignInAlt className="h-5 w-5" />
              <span className="ml-2">Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
