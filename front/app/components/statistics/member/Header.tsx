import React from "react";
import { FaHome } from "react-icons/fa";
import SearchBar from "./SearchBar";
import NotificationsButton from "./NotificationsButton";
import ProfileDropdown from "./ProfileDropdown";
import ReportButton from "./ReportButton";
import NewPostButton from "./NewPostButton";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <nav className="bg-gray-800 shadow-sm ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center w-full mt-2">
          <ul className="flex items-center space-x-4 w-full lg:w-auto lg:space-x-0">
          <li className="flex items-center">
          <FaHome className="h-5 w-5" />
          <Link href="/" className="ml-2 hover:underline">
            Home
          </Link>
        </li>
            <li className="flex items-center justify-center lg:justify-start w-full lg:w-[400px] mt-4 lg:mt-0">
              <SearchBar />
            </li>
          </ul>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0 w-full lg:w-auto justify-center lg:justify-end">
            <NotificationsButton />
            <ProfileDropdown />
            <NewPostButton />
            <ReportButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
