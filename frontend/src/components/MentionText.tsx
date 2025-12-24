import React from "react";
import Link from "next/link";

// Turns @mentions in text into clickable profile links
export function MentionText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(@[\w]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^@[\w]+$/.test(part)) {
          const username = part.slice(1);
          return (
            <Link
              key={i}
              href={`/profile/${username}`}
              className="text-blue-500 hover:underline"
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
