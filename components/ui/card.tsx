import * as React from "react";
import Image from "next/image";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import CardBackgroundImage from "@/public/cardbackground/CardBg.png"

export interface CardProps {
  mainImage: string;
  title: React.ReactNode;
  buttonLink: string;
  buttonText: string;
}

export function Card({ mainImage, title, buttonLink, buttonText }: CardProps) {
  // Helper to extract text from ReactNode for alt attribute
  const getTitleText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) {
      return node.map(getTitleText).join(' ');
    }
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props.children) {
        return getTitleText(props.children);
      }
    }
    return 'Card image';
  };
  
  const titleText = getTitleText(title);
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
        <h2 className="text-2xl font-bold text-[#333333] mb-4 leading-tight">
          {title}
        </h2>
        <Button
          asChild
          className="bg-gradient-to-r from-[#66b33b] to-[#4a8a2a] text-white font-bold rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <a href={buttonLink}>{buttonText}</a>
        </Button>
      </div>

      {/* Right Section - Main Image (55%) */}
      <div className="relative w-[55%] h-full flex items-center justify-center z-10">
        <div className="relative w-[92%] h-full">
          <Image
            src={mainImage}
            alt={titleText}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 55vw"
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

