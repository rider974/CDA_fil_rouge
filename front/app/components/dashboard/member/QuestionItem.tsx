import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  date: string;
  title: string;
  content: string;
  rating: number;
  views: number;
  replies: number;
}

interface QuestionItemProps {
  question: Comment;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "text-yellow-500" : "text-gray-300"}
        aria-hidden="true"
      />
    ));
  };

  return (
    <>
      <ul className="space-y-4">
        <li className="flex items-start space-x-4 py-4">
          <Image
            className="h-10 w-10 rounded-full"
            width={32}
            height={32}
            src={question.authorAvatar}
            alt="author question"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {question.author}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(question.date).toLocaleString()}
            </p>
            <h3 className="mt-1 text-base font-medium text-gray-900">
              {question.title}
            </h3>
            <p className="mt-2 text-sm text-gray-700">{question.content}</p>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                {renderStars(question.rating)}
                <span className="ml-2">{question.rating} / 5</span>
              </div>
             
              <span >{question.replies} Replies</span>
              <span >{question.views} Views</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default QuestionItem;
