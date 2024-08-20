import React, { useState } from "react";

type SearchBarRadioButtonProps = {
  options: { id: string; label: string; notificationCount?: number }[];
};

const SearchBarRadioButton: React.FC<SearchBarRadioButtonProps> = ({
  options,
}) => {
  const [selectedTab, setSelectedTab] = useState(options[0].id);

  return (
    <div className="flex justify-center items-center">
         <div className="relative bg-white shadow-lg rounded-full p-3 flex space-x-4 md:space-x-8 overflow-x-auto">
        {options.map((option) => (
          <div
            key={option.id}
            className="relative flex items-center justify-center"
          >
            <input
              type="radio"
              id={option.id}
              name="tabs"
              className="hidden"
              checked={selectedTab === option.id}
              onChange={() => setSelectedTab(option.id)}
            />
            <label
              htmlFor={option.id}
              className={`flex items-center justify-center h-10 px-4 
                text-sm font-medium rounded-full cursor-pointer transition-colors duration-150 relative ${
                  selectedTab === option.id ? "text-blue-600" : "text-black"
                }`}
            >
              {option.label}
              {option.notificationCount && (
                <span
                  className={`flex items-center justify-center w-5 h-5 absolute -top-2 right-0 text-xs rounded-full transition-colors duration-150 ${
                    selectedTab === option.id
                      ? "bg-blue-600 text-white"
                      : "bg-blue-200 text-black"
                  }`}
                >
                  {option.notificationCount}
                </span>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBarRadioButton;
