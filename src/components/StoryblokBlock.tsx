
import React, { useEffect, useState } from "react";

/**
 * Displays a simple Storyblok text field.
 * You must provide your PUBLIC API KEY in process.env or as a prop.
 */
export default function StoryblokBlock({
  storySlug = "welcome",
  apiKey = "",
  ...props
}: { storySlug?: string; apiKey?: string }) {
  const [story, setStory] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // You may set API key directly here or via prop
    const PUBLIC_API_KEY = apiKey || ""; // insert your key, or use ENV var in prod
    if (!PUBLIC_API_KEY) {
      setError("Set your Storyblok API key in StoryblokBlock.tsx");
      return;
    }
    // Add better debug output
    fetch(
      `https://api.storyblok.com/v2/cdn/stories/${storySlug}?token=${PUBLIC_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Storyblok API result:", data);
        if (data.story) {
          setStory(data.story);
          setError("");
        } else if (data.error) {
          setError("Storyblok error: " + data.error);
          setStory(null);
        } else {
          setError("No story/content found for slug: " + storySlug);
          setStory(null);
        }
      })
      .catch((e) => {
        console.error("Storyblok fetch error:", e);
        setError("Error fetching Storyblok content");
      });
  }, [storySlug, apiKey]);

  if (error)
    return (
      <div className="px-3 py-2 text-xs bg-amber-100 border border-amber-200 text-amber-600 rounded">
        {error}
      </div>
    );
  if (!story)
    return (
      <div className="px-3 py-2 text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded">
        Loading Storyblok...
      </div>
    );
  return (
    <div className="my-4 p-4 border bg-white/80 rounded shadow pixel-font text-[#233f24]">
      <div className="font-bold mb-2 text-base">
        Storyblok: {story.name || storySlug}
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: story.content && story.content.text
            ? story.content.text
            : "No content found in Storyblok!",
        }}
      />
    </div>
  );
}

