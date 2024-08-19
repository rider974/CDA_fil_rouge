"use client";

import CommentsSection from "@/app/components/statistics/member/CommentsSection";
import Header from "@/app/components/statistics/member/Header";
import SocialInteractionPanel from "@/app/components/statistics/member/SocialInteractionPanel";
import StatCard from "@/app/components/statistics/member/StatCard";
import VideoSection from "@/app/components/statistics/member/VideoSection";
import WhoToFollowSection from "@/app/components/statistics/member/WhoToFollowSection";
import { FaHeart, FaThumbsUp, FaDownload, FaUserFriends } from "react-icons/fa";

export default function MemberDashboard() {
  return (
    <div className="bg-[#ECEFF1] min-h-screen w-screen pt-10">
      <div className="mt-24 sm:mt-20 md:mt-16 lg:mt-8">
        <Header />
      </div>

      <section className="px-8 pb-4 flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/2">
          <SocialInteractionPanel />
        </div>
        <div className="lg:w-1/2">
          <VideoSection />
        </div>
      </section>

      <section className="grid lg:grid-cols-12 gap-6 px-8 pb-8">
        <div className="lg:col-span-2 space-y-4 mt-5">
          <StatCard
            icon={<FaHeart className="w-5 h-5 text-red-500" />}
            title="Favorites"
            value="488"
            percentage="5"
            increase={true}
          />
          <StatCard
            icon={<FaUserFriends className="w-5 h-5 text-orange-500" />}
            title="Followers"
            value="2 058"
            percentage="46"
            increase={true}
          />
          <StatCard
            icon={<FaThumbsUp className="w-5 h-5 text-blue-500" />}
            title="Likes"
            value="1340"
            percentage="3"
            increase={false}
          />
          <StatCard
            icon={<FaDownload className="w-5 h-5 text-green-500" />}
            title="Downloads"
            value="58"
            percentage="7"
            increase={true}
          />
        </div>

        <div className="lg:col-span-6">
          <CommentsSection />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <WhoToFollowSection />
        </div>
      </section>
    </div>
  );
}
