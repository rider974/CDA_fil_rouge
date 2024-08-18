import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaDownload } from "react-icons/fa";

const newsFeedItems = [
  {
    id: 1,
    authorName: "Alexandre Mathiot",
    authorUsername: "@AlexandreMathiot",
    authorAvatar: "/AM-avatar.jpg",
    content:
      "This AI escapes researchers' control by rewriting its own code to extend its capabilities",
    likes: 291,
    date: "2024-08-18",
    downloadIcon: <FaDownload className="h-5 w-5 text-green-500" />,
  },
  {
    id: 2,
    authorName: "conglu1997",
    authorUsername: "@conglu1997",
    authorAvatar: "/CG-avatar.jpg",
    content:
      "The AI Scientist: Towards Fully Automated Open-Ende Scientific Discovery 🧑‍🔬 - SakanaAI/AI-Scientist",
    likes: 323,
    date: "2024-07-06",
    downloadIcon: <FaDownload className="h-5 w-5 text-green-500" />,
  },
  {
    id: 3,
    authorName: "Jane Doe",
    authorUsername: "@JaneDoe",
    authorAvatar: "/JD-avatar.jpg",
    content: "New breakthrough in quantum computing could change the world",
    likes: 45,
    date: "2024-06-22",
    downloadIcon: <FaDownload className="h-5 w-5 text-green-500" />,
  },
];

const WhoToFollowSection: React.FC = () => {
  return (
    <aside className="xl:col-span-4 xl:block mt-5">
      <div className="sticky top-4 space-y-4">
        <section aria-labelledby="who-to-follow-heading">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h2
                id="who-to-follow-heading"
                className="text-base font-medium text-gray-900"
              >
                Who to follow
              </h2>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200">
                  <li className="flex items-center space-x-3 py-4">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src="/PM-avatar.png"
                        width={32}
                        height={32}
                        alt="author-image"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        <Link href="#">Pascal Minatchy</Link>
                      </p>
                      <p className="text-sm text-gray-500">
                        <Link href="#">@Pascal Minatchy</Link>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-sm font-medium text-rose-700 hover:bg-rose-100"
                      >
                        Follow
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  href="#"
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div className="my-4">
          <hr className="border-t-2 border-gray-300" />
        </div>
        <section aria-labelledby="trending-heading">
          <div className="rounded-lg bg-white shadow ">
            <div className="p-6">
              <h2
                id="trending-heading"
                className="text-base font-medium text-gray-900"
              >
                News feed
              </h2>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200">
                  {newsFeedItems.map((item) => (
                    <li key={item.id} className="flex space-x-3 py-4">
                      <div className="flex-shrink-0">
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={item.authorAvatar}
                          width={32}
                          height={32}
                          alt="author-image"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <Link href="#">{item.authorName}</Link>
                        </p>
                        <p className="text-sm text-gray-500">
                          <Link href="#">{item.authorUsername}</Link>
                        </p>
                        <p className="text-sm text-gray-800 mt-1">
                          {item.content}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {item.likes}
                            </span>
                            <span>likes</span>
                          </span>
                          <span className="ml-4">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          <span className="ml-4">
                            {item.downloadIcon}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View all
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default WhoToFollowSection;
