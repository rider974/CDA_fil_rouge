import Link from "next/link";
import React from "react";
import { FiEdit } from "react-icons/fi"; 

const NewPostButton: React.FC = () => {
  return (
    <Link
      href="#"
      className="ml-2 inline-flex items-center rounded-md border border-transparent bg-rose-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      <FiEdit className="mr-2 h-4 w-4" /> 
      New Post
    </Link>
  );
};

export default NewPostButton;