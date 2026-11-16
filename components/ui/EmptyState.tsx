"use client";

import React from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function GiftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-20 w-20 text-blush"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
      />
    </svg>
  );
}

export default function EmptyState({
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
    >
      <GiftIcon />
      <div>
        <h3 className="font-serif text-2xl font-semibold text-burgundy">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-ink/60">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="btn mt-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
