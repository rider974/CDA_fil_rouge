import React from "react";

interface Video {
  id: string;
  title: string;
  url: string;
}

const videos: Video[] = [
  {
    id: "1",
    title: "Introduction to TypeScript",
    url: "https://www.youtube.com/embed/2ArU2F92rds",
  },
  {
    id: "2",
    title: "Next.js Tutorial for Beginners",
    url: "https://www.youtube.com/embed/ZVnjOPwW4ZA",
  },
  {
    id: "3",
    title: "Advanced React Patterns",
    url: "https://www.youtube.com/embed/MSq_DCRxOxw",
  },
];

const VideoSection: React.FC = () => {
  return (
    <section className="px-8 pb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recommended Videos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={video.url}
                title={video.title}
                style={{ border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoSection;
