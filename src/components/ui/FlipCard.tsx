import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  className?: string;
};

export function FlipCard({ front, back, className = "" }: FlipCardProps) {
  return (
    <div className={`group perspective-[1000px] ${className}`}>
      <div className="relative transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Frente */}
        <div className="[backface-visibility:hidden]">
          {front}
        </div>
        {/* Verso */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
}
