import Image from "next/image";
import storiesData from "@/data/stories.json";
import { SiteData, Story, TopStory } from "@/types/stories";

const data = storiesData as SiteData;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function TopStoryBlock({ story, side }: { story: TopStory; side: "left" | "right" }) {
  const accentColor = side === "left" ? "#1a56c4" : "#c41a1a";
  return (
    <div className="mb-4">
      <a href={story.url} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full mb-2 overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <Image
            src={story.photo}
            alt={story.photoAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <h2
          className="text-xl font-bold leading-tight uppercase tracking-wide hover:underline"
          style={{ color: accentColor, fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {story.headline}
        </h2>
      </a>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{story.source}</p>
    </div>
  );
}

function StoryLink({ story }: { story: Story }) {
  return (
    <div className="py-1 border-b border-gray-200">
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold uppercase tracking-wide text-black hover:text-gray-600 leading-snug"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {story.headline}
      </a>
      <span className="text-xs text-gray-400 ml-2 uppercase tracking-widest">{story.source}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>

      {/* Header */}
      <header className="border-b-4 border-black pb-3 pt-4 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-6xl font-black uppercase tracking-widest"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.15em" }}
          >
            FLIPSIDE
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
            Two stories. One truth.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(data.lastUpdated)}
          </p>
        </div>
      </header>

      {/* Column Headers */}
      <div className="max-w-6xl mx-auto flex border-b-2 border-black">
        <div className="w-1/2 py-2 px-4 border-r-2 border-black" style={{ backgroundColor: "#e8f0ff" }}>
          <h2
            className="text-center text-sm font-black uppercase tracking-widest"
            style={{ color: "#1a56c4" }}
          >
            ◀ THE LEFT
          </h2>
        </div>
        <div className="w-1/2 py-2 px-4" style={{ backgroundColor: "#ffe8e8" }}>
          <h2
            className="text-center text-sm font-black uppercase tracking-widest"
            style={{ color: "#c41a1a" }}
          >
            THE RIGHT ▶
          </h2>
        </div>
      </div>

      {/* Two-Pane Content */}
      <main className="max-w-6xl mx-auto flex">

        {/* Left Pane */}
        <div className="w-1/2 px-4 py-4 border-r-2 border-black">
          <TopStoryBlock story={data.left.topStory} side="left" />
          <div className="mt-2">
            {data.left.stories.map((story, i) => (
              <StoryLink key={i} story={story} />
            ))}
          </div>
        </div>

        {/* Right Pane */}
        <div className="w-1/2 px-4 py-4">
          <TopStoryBlock story={data.right.topStory} side="right" />
          <div className="mt-2">
            {data.right.stories.map((story, i) => (
              <StoryLink key={i} story={story} />
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-8 py-3 text-center text-xs text-gray-400 uppercase tracking-widest">
        Flipside · Curated by humans, assisted by AI · Not affiliated with any political party
      </footer>

    </div>
  );
}
