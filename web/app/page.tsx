import storiesData from "@/data/stories.json";
import { SiteData } from "@/types/stories";
import ComparisonSlider from "./ComparisonSlider";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">

      {/* Masthead */}
      <header className="border-b-4 border-black pb-3 pt-4 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-6xl font-black uppercase"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.15em" }}
          >
            FLIPSIDE
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
            Two stories. One truth.
          </p>
          <p className="text-xs text-gray-400 mt-1">{formatDate(data.lastUpdated)}</p>
          <p className="text-xs text-gray-400 mt-2 italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Drag the center bar to shift perspective
          </p>
        </div>
      </header>

      {/* Comparison slider */}
      <main className="max-w-6xl mx-auto border-l border-r border-black">
        <ComparisonSlider data={data} />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-8 py-3 text-center text-xs text-gray-400 uppercase tracking-widest">
        Flipside · Curated by humans, assisted by AI · Not affiliated with any political party
      </footer>

    </div>
  );
}
