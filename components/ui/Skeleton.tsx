"use client";

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
  lines?: number;
}

export default function Skeleton({ className = "", rounded = false, lines }: SkeletonProps) {
  const base =
    "animate-pulse bg-gradient-to-r from-blush via-white to-blush bg-[length:200%_100%]";

  if (lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 ${rounded ? "rounded-full" : "rounded-md"} ${base} ${
              i === lines - 1 ? "w-3/4" : "w-full"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${base} ${rounded ? "rounded-full" : "rounded-md"} ${className}`}
    />
  );
}
