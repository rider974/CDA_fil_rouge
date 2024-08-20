"use client";

import CommentsSection from "@/app/components/dashboard/member/CommentsSection";
import NavbarMember from "@/app/components/dashboard/member/NavBarMember";
import SocialInteractionPanel from "@/app/components/dashboard/member/SocialInteractionPanel";
import StatCard from "@/app/components/dashboard/member/StatCard";
import VideoSection from "@/app/components/dashboard/member/VideoSection";
import WhoToFollowSection from "@/app/components/dashboard/member/WhoToFollowSection";
import { FaHeart, FaThumbsUp, FaDownload, FaUserFriends, FaComment } from "react-icons/fa";

export default function MemberDashboard() {
  return (
    <div className="bg-[#ECEFF1] min-h-screen w-screen pt-0 md:pt-8 lg:pt-6">
      <div className="mt-4 sm:mt-4 md:mt-2 lg:mt-10">
        <NavbarMember />
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
            icon={<FaComment className="w-5 h-5 text-purple-500" />}
            title="Comments"
            value="89"
            percentage="24"
            increase={true}
          />
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
