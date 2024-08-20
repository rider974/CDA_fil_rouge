"use client";

import { ArticleCard } from "@/app/components/dashboard/visitor/ArticleCard";
import SearchBarRadioButton from "../../components/resource/SearchBarRadioButton";

export default function Tag() {
  const options = [
    { id: "radio-1", label: "# TypeScript", notificationCount: 33 },
    { id: "radio-2", label: "# Next", notificationCount: 28 },
    { id: "radio-3", label: "# AI", notificationCount: 12 },
    { id: "radio-4", label: "# ORM", notificationCount: 8 },
    { id: "radio-5", label: "# AI", notificationCount: 1 },
    { id: "radio-6", label: "# PYTHON", notificationCount: 3 },
    { id: "radio-7", label: "# TOOLS", notificationCount: 7 },
  ];

  const articles = [
    {
      url: "https://medium.com/@rs4528090/understanding-typescript-a-comprehensive-guide-851697a8e424",
      imageUrl: "/typescript.png",
      title: "Understanding TypeScript",
      description:
        "Deep dive into TypeScript, a powerful tool for building robust and maintainable web applications.",
      date: "22/07/2024",
    },
    {
      url: "https://medium.com/@rs4528090/understanding-typescript-a-comprehensive-guide-851697a8e424",
      imageUrl: "/typescript.png",
      title: "Understanding TypeScript",
      description:
        "Deep dive into TypeScript, a powerful tool for building robust and maintainable web applications.",
      date: "22/07/2024",
    },
    {
      url: "https://medium.com/@rs4528090/understanding-typescript-a-comprehensive-guide-851697a8e424",
      imageUrl: "/typescript.png",
      title: "Understanding TypeScript",
      description:
        "Deep dive into TypeScript, a powerful tool for building robust and maintainable web applications.",
      date: "22/07/2024",
    },
  ];

  return (
    <section className="bg-[#ECEFF1] flex flex-col items-start justify-start min-h-screen w-full p-4 mt-10">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-pink-600 text-white rounded-lg shadow-lg flex items-center justify-center">
          <h1 className="text-xl sm:text-2xl font-bold">TAG</h1>
        </div>
        <div className="p-4 w-full">
          <SearchBarRadioButton options={options} />
        </div>
      </div>

      <section className="mt-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              url={article.url}
              imageUrl={article.imageUrl}
              title={article.title}
              description={article.description}
              date={article.date}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
