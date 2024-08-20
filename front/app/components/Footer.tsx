import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 shadow-sm relative bottom-0 left-0 right-0">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
        <div className="text-center lg:text-left">
          <h5 className="font-bold text-lg">BeginnersAppDev</h5>
          <p className="mt-2 text-sm">
            Empowering collaboration and innovation through technology.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center mt-4 lg:mt-0 space-y-2 lg:space-y-0 lg:space-x-8">
          <a href="#" className="text-sm hover:text-gray-400">
            About Us
          </a>
          <a href="#" className="text-sm hover:text-gray-400">
            Privacy Policy
          </a>
          <a href="#" className="text-sm hover:text-gray-400">
            Terms of Service
          </a>
          <a href="#" className="text-sm hover:text-gray-400">
            Contact
          </a>
        </div>

        <div className="flex space-x-4 mt-4 lg:mt-0">
          <a
            href="https://github.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub className="w-6 h-6 hover:text-gray-400" />
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6 hover:text-gray-400" />
          </a>
        </div>

        <div className="mt-4 lg:mt-0 text-center lg:text-right">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} BeginnersAppDev. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
