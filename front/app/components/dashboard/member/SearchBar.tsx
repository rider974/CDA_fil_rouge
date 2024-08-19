import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
  return (
    <div className="w-full">
      <label htmlFor="search" className="sr-only">Search</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id="search"
          name="search"
          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-rose-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500 sm:text-sm"
          placeholder="Search"
          type="search"
        />
      </div>
    </div>
  );
};

export default SearchBar;