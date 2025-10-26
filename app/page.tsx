"use client";
import Lottie from "lottie-react";
import ComingSoon from "@/public/lottie/Cooking egg.json";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="w-[45vh] h-[45vh]">
          <Lottie animationData={ComingSoon} className="w-full h-full" loop={true} />
        </div>
        <h1 className="text-6xl font-black text-gray-800">Coming Soon!</h1>
        <p className="text-2xl font-black ">YumYard<span className="text-typography-primary">.Cafe</span></p>
      </div>
    </div>
  );
}
