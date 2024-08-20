import Image from 'next/image';
import React, { useState } from 'react';
import avatar from './../../../../public/FMavatar.jpg'

const ProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative ml-5 flex-shrink-0">
      <button
        type="button"
        className="flex rounded-full"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="sr-only">Open user menu</span>
        <Image
          className="h-10 w-10 rounded-full"
          src={avatar}
          alt="Prodile image"
          width={32}
          height={32}
        />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <a href="#" className="block py-2 px-4 text-sm text-gray-700">Your Profile</a>
          <a href="#" className="block py-2 px-4 text-sm text-gray-700">Settings</a>
          <a href="#" className="block py-2 px-4 text-sm text-gray-700">Sign out</a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;