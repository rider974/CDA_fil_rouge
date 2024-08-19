import React from "react";
import QuestionItem from "./QuestionItem";

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

interface QuestionListProps {
  questions: Comment[];
}

const QuestionList: React.FC<QuestionListProps> = ({ questions }) => {
  return (
    <>
      <ul role="list" className="space-y-4">
        {questions.map((question) => (
          <li key={question.id} className="border-b border-gray-200 pb-4">
            <QuestionItem question={question} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default QuestionList;
