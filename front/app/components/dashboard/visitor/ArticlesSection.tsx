import React from "react";
import { ArticleCard } from "./ArticleCard";

export const ArticlesSection: React.FC = () => {
  const articles = [
    {
      url: "https://blog.lesjeudis.com/introduction-javascript",
      imageUrl: "/javascript.png",
      title: "Introduction to JavaScript",
      description:
        "Learn the basics of JavaScript, the most popular programming language for web development.",
      date: "18/08/2024",
      badge: "JS",
    },
    {
      url: "https://blog.stackademic.com/exploring-advanced-component-patterns-in-react-render-props-component-composition-and-hooks-8a20132cde6b",
      imageUrl: "/react.png",
      title: "Advanced React Patterns",
      description:
        "Master advanced patterns and techniques in React for building scalable web applications.",
      date: "11/08/2024",
      badge: "React",
    },
    {
      url: "https://medium.com/@rs4528090/understanding-typescript-a-comprehensive-guide-851697a8e424",
      imageUrl: "/typescript.png",
      title: "Understanding TypeScript",
      description:
        "Deep dive into TypeScript, a powerful tool for building robust and maintainable web applications.",
      date: "22/07/2024",
      badge: "TS",
    },
    {
      url: "https://www.etic-insa.com/datascience-ia/python",
      imageUrl: "/python.png",
      title: "Python for Data Science",
      description:
        "Explore Python’s capabilities in data science, from basic data manipulation to advanced analysis.",
      date: "05/06/2024",
      badge: "Python",
    },
    {
      url: "https://www.tensorflow.org/learn",
      imageUrl: "/tensorFlow.png",
      title: "Machine Learning with TensorFlow",
      description:
        "Discover the power of TensorFlow for building and deploying machine learning models.",
      date: "05/05/2024",
      badge: "Tools",
    },
    {
      url: "https://www.deeplearning.ai/learn",
      imageUrl: "/deeplearning.png",
      title: "Introduction to Deep Learning",
      description:
        "Learn the fundamentals of deep learning and explore its applications across various domains.",
      date: "28/04/2024",
      badge: "DeepLearning",
    },
    {
      url: "https://huggingface.co/learn/nlp",
      imageUrl: "/huggingface.png",
      title: "Natural Language Processing with Hugging Face",
      description:
        "Dive into natural language processing (NLP) using Hugging Face's state-of-the-art models and libraries.",
      date: "22/04/2024",
      badge: "HuggingFace",
    },
    {
      url: "https://martinfowler.com/architecture",
      imageUrl: "/architecture.png",
      title: "Software Architecture Best Practices",
      description:
        "Learn the principles of software architecture, including design patterns, system structures, and best practices for building maintainable and scalable applications.",
      date: "26/03/2024",
      badge: "Architecte",
    },
    {
      url: "https://www-phonandroid-com.cdn.ampproject.org/c/s/www.phonandroid.com/cette-ia-echappe-au-controle-des-chercheurs-en-reecrivant-son-propre-code-pour-etendre-ses-capacites.html/amp",
      imageUrl: "/ia.png",
      title: "This AI Escapes Researchers' Control by Rewriting Its Own Code",
      description:
        "Learn how an AI managed to modify its own code to extend its capabilities, raising questions about the safety and ethics of artificial intelligence.",
      date: "02/03/2024",
      badge: "AI",
    },
  ];

  return (
    <section className="bg-[#ECEFF1] py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">News Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              url={article.url}
              imageUrl={article.imageUrl}
              title={article.title}
              description={article.description}
              date={article.date}
              badge={article.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
