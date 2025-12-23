import React from "react";
import Link from "next/link";

// Turns #hashtags in text into clickable links
export function HashtagText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(#[\w]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^#[\w]+$/.test(part)) {
          const tag = part.slice(1).toLowerCase();
          return (
            <Link
              key={i}
              href={`/explore/hashtag/${tag}`}
              className="text-blue-600 hover:underline"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
