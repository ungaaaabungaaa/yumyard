import * as React from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import CardBackgroundImage from "@/public/cardbackground/CardBg.webp"

export interface CardProps {
  lottieAnimation: object; // Lottie animation JSON data
  title: React.ReactNode;
  buttonLink: string;
  buttonText: string;
}

export function Card({ lottieAnimation, title, buttonLink, buttonText }: CardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-row items-center justify-between rounded-3xl overflow-hidden",
        "h-52 w-[82%] flex-shrink-0"
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={CardBackgroundImage}
          alt="Card background"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Left Section - Text and Button (45%) */}
      <div className="flex flex-col items-start justify-center pl-6 z-10 w-[45%] min-w-0">
        <h2 className="text-2xl font-black text-typography-heading mb-4 leading-tight">
          {title}
        </h2>
        <Button
          asChild
          className="w-auto  bg-background-primary hover:bg-background-primary   text-typography-white py-6 px-8 rounded-2xl text-lg font-bold"
        >
          <a href={buttonLink}>{buttonText}</a>
        </Button>
      </div>

      {/* Right Section - Lottie Animation (55%) */}
      <div className="relative w-[55%] h-full flex items-center justify-center z-10">
        <div className="relative w-[92%] h-full">
          <Lottie
            animationData={lottieAnimation}
            loop={true}
            className="w-full h-full"
          />
          {/* Decorative sparkles */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
          <div className="absolute bottom-4 left-2 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>
    </div>
  );
}

export interface CardsProps {
  cards: CardProps[];
}

export function Cards({ cards }: CardsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide mb-4">
      <div className="flex flex-row gap-8">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

