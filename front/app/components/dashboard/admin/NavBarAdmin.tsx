"use client";

import Link from "next/link";
import { FaHome, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagButton } from "../../resource/TagButton";
import { PdfButton } from "../../resource/PdfButton";
import { CheatSheetButton } from "../../resource/CheatSheetButton";
import NotificationsButton from "../member/NotificationsButton";
import ProfileDropdown from "../member/ProfileDropdown";
import NewPostButton from "../member/NewPostButton";
import ReportButton from "../member/ReportButton";


export default function NavbarAdmin() {
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

      <div className="hidden md:flex items-center space-x-4">
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

      <div className="hidden md:flex items-center space-x-4">
        <NotificationsButton />
        <ProfileDropdown />
        <NewPostButton />
        <ReportButton />
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
        <div className="md:hidden absolute top-12 left-0 w-full bg-gray-800 text-white py-4 z-50">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full px-4 mb-4"
          >
            <input
              type="text"
              className="px-3 py-2 rounded-lg text-gray-800 w-full"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="ml-2 text-white hover:underline">
              <FaSearch />
            </button>
          </form>

          <div className="px-4 mb-4">
            <div className="flex flex-col space-y-4">
              <div className="-ml-4">
                <div className="mb-4">
                  <TagButton />
                </div>
                <div className="mb-4">
                  <PdfButton />
                </div>
                <div>
                  <CheatSheetButton />
                </div>
              </div>

              <NotificationsButton />
              <ProfileDropdown />
              <NewPostButton />
              <ReportButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
