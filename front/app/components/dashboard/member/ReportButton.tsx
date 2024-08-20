import Link from "next/link";
import React from "react";
import { FiFlag } from "react-icons/fi";

const ReportButton: React.FC = () => {
  return (
   <Link
      href="#"
      className="ml-2 inline-flex items-center rounded-md border border-transparent bg-yellow-300 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      <FiFlag className="mr-2 h-4 w-4" />
      Report
    </Link>
  );
};

export default ReportButton;
