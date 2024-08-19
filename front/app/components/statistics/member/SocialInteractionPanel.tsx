import React, { useState } from "react";
import {
  FaUserPlus,
  FaComments,
  FaCalendar,
  FaBell,
  FaEnvelope,
  FaCog,
} from "react-icons/fa";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Discussion {
  topic: string;
  link: string;
  date: string;
}

const SocialInteractionPanel: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("discussions");

  const tabs: Tab[] = [
    {
      id: "discussions",
      label: "Discussions",
      icon: <FaEnvelope className="h-5 w-5" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell className="h-5 w-5" />,
    },
    { id: "settings", label: "Settings", icon: <FaCog className="h-5 w-5" /> },
  ];

  const discussions: Discussion[] = [
    { topic: "Discussion on TypeScript", link: "#", date: "09/10/2024" },
    { topic: "Discussion on React", link: "#", date: "23/11/2024" },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "discussions":
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Group Discussions
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Participate in discussions on topics that interest you.
            </p>
            <ul className="mt-4 space-y-2">
              {discussions.map((discussion, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="text-[#f59e0b]" />
                    <span className="text-sm text-gray-500">
                      {discussion.date}
                    </span>
                  </div>
                  <div className="flex-1 sm:ml-12 flex items-center space-x-2">
                    <FaComments className="text-[#10b981]" />
                    <span className="text-gray-800">{discussion.topic}</span>
                  </div>
                  <a
                    href={discussion.link}
                    className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-800"
                  >
                    <FaUserPlus className="text-green-500" />
                    <span>Join</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <p className="mt-2 text-sm text-gray-600">
              Receive notifications for new content matching your interests.
            </p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-800">New posts on TypeScript</span>
              </label>
              <label className="flex items-center space-x-3 mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-800">Discussions on React</span>
              </label>
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Notification Settings
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Configure your preferences for notifications and discussions.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notification frequency
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>Instant</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discussion language
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>English</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8">
      <div className="flex flex-wrap justify-around sm:justify-between border-b border-gray-200 pb-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center space-x-2 text-sm font-medium ${
              selectedTab === tab.id ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default SocialInteractionPanel;