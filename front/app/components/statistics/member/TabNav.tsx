import React from 'react';

interface Tab {
    title: string;
    current: boolean;
  }
  
  interface TabNavProps {
    tabs: Tab[];
  }
const TabNav: React.FC<TabNavProps> = ({ tabs }) => {
  return (
    <div className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
      {tabs.map((tab, idx) => (
        <a
          key={idx}
          href="#"
          className={`group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 ${
            tab.current ? 'text-gray-900 rounded-l-lg' : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-current={tab.current ? 'page' : undefined}
        >
          <span>{tab.title}</span>
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 h-0.5 ${
              tab.current ? 'bg-green-500' : 'bg-transparent'
            }`}
          ></span>
        </a>
      ))}
    </div>
  );
};

export default TabNav;