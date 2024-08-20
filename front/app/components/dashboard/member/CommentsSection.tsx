import React, { useState } from "react";
import TabNav from "./TabNav";
import QuestionList from "./QuestionList";

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  date: string;
  title: string;
  content: string;
  rating: number;
  replies: number;
  views: number;
}

interface Tab {
  title: string;
  current: boolean;
}

const CommentsSection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Recent");

  const tabs: Tab[] = [
    { title: "Recent", current: selectedTab === "Recent" },
    { title: "Most Liked", current: selectedTab === "Most Liked" },
    { title: "Most Answers", current: selectedTab === "Most Answers" },
  ];

  const questions: Comment[] = [
    {
      id: "1",
      author: "Thomas Legrand",
      authorAvatar: "/TLavatar.png",
      date: "2020-12-09T11:43:00",
      title: "You should use TypeOrm framework",
      content:
        "TypeOrm is an excellent choice for those who want to integrate TypeScript and ORM seamlessly. It offers a robust and flexible way to interact with databases, making it a powerful tool for any developer looking to build scalable and maintainable applications...",
      rating: 4,
      replies: 11,
      views: 458,
    },
    {
      id: "2",
      author: "Florence Martin",
      authorAvatar: "/FMavatar.jpg",
      date: "2020-12-09T11:43:00",
      title: "Why Next.js ?",
      content:
        "Next.js is a powerful React framework that enables developers to build fast, scalable, and SEO-friendly web applications. Its server-side rendering capabilities, static site generation, and API routes make it a go-to choice for modern web development...",
      rating: 3,
      replies: 11,
      views: 270,
    },
    {
      id: "3",
      author: "Pascal Minatchy",
      authorAvatar: "/PM-avatar.png",
      date: "2020-12-09T11:43:00",
      title: "Understanding Java and its Ecosystem",
      content:
        "Java is one of the most widely used programming languages, known for its platform independence and robustness. It powers a wide range of applications, from web and mobile apps to large enterprise systems...",
      rating: 3,
      replies: 11,
      views: 270,
    },
  ];

  return (
    <main className="lg:col-span-9 xl:col-span-6">
      <div className="px-4 sm:px-0">
        <div className="sm:hidden">
          <p className="sr-only">Select a tab</p>
          <select
            id="question-tabs"
            className="block w-full rounded-md border-gray-300 text-base font-medium text-gray-900 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value)}
          >
            {tabs.map((tab, idx) => (
              <option key={idx} value={tab.title}>
                {tab.title}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <TabNav tabs={tabs} />
        </div>
      </div>
      <div className="mt-4">
        <h1 className="sr-only">Recent questions</h1>
        <div className="bg-white rounded-lg shadow p-4">
          <QuestionList questions={questions} />
        </div>
      </div>
    </main>
  );
};

export default CommentsSection;
