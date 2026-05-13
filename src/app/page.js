import HeroSection from "../components/summarizer/HeroSection";
import SummarizerInput from "../components/summarizer/SummarizerInput";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid pointer-events-none opacity-40"
        aria-hidden="true"
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(52,211,153,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <HeroSection />
        <SummarizerInput />
      </div>
    </div>
  );
}
