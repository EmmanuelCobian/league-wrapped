"use client";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import ShareableCard from "./ShareableCard";

export default function SummaryScreen({ onNavigate, data }) {
  const [visibleStats, setVisibleStats] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const stats = data.summary;

  useEffect(() => {
    const intervals = [];
    for (let i = 0; i <= 11; i++) {
      const timeout = setTimeout(() => {
        setVisibleStats(i);
      }, i * 200);
      intervals.push(timeout);
    }

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  const handleShare = async () => {
    setIsGenerating(true);
    setShowShareCard(true);

    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const element = document.getElementById("shareable-card");

      if (!element) {
        throw new Error("Card not found");
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#0a0e27",
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: 600,
        windowHeight: 800,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Failed to generate image");
        }

        // Check if Web Share API is available (mobile)
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], "league-wrapped-2024.png", {
              type: "image/png",
            });

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: "My League Wrapped 2024",
                text: "Check out my League of Legends season recap!",
                files: [file],
              });
            } else {
              downloadImage(canvas);
            }
          } catch (err) {
            if (err.name !== "AbortError") {
              downloadImage(canvas);
            }
          }
        } else {
          downloadImage(canvas);
        }

        setIsGenerating(false);
        setShowShareCard(false);
      }, "image/png");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
      setIsGenerating(false);
      setShowShareCard(false);
    }
  };

  const downloadImage = (canvas) => {
    const link = document.createElement("a");
    link.download = `league-wrapped-2024-${data.gameName || "summary"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="text-4xl font-bold text-black dark:text-white">
          Your Season Summary
        </div>

        <div className="flex flex-col items-center gap-8 text-center w-full">
          <h1
            className={`text-3xl font-semibold text-black dark:text-white mb-8 transition-all duration-700 ${
              visibleStats >= 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            How skilled are you?
          </h1>

          <div className="w-full max-w-5xl space-y-6">
            {/* Best Role */}
            <div
              className={`transition-all duration-700 ${
                visibleStats >= 3
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">
                  Best Role
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.bestRole}
                </span>
              </div>
            </div>

            {/* Best Role Winrate */}
            <div
              className={`transition-all duration-700 ${
                visibleStats >= 5
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">
                  Best Role Winrate
                </span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.bestRoleWinrate}%
                </span>
              </div>
            </div>

            {/* Champions Played */}
            <div
              className={`transition-all duration-700 ${
                visibleStats >= 7
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">
                  Champions Played
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.champsPlayed}
                </span>
              </div>
            </div>

            {/* Minutes Played */}
            <div
              className={`transition-all duration-700 ${
                visibleStats >= 9
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">
                  Time Wasted (LOL)
                </span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.minutesPlayed}
                </span>
              </div>
            </div>

            {/* Top Champion */}
            <div
              className={`transition-all duration-700 ${
                visibleStats >= 11
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">
                  Most Played Champion
                </span>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.topChamp}
                </span>
              </div>
            </div>

            {/* Top 3 Champions */}
            <div
              className={`transition-all duration-700 ${
                visibleStats >= 11
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white block mb-4">
                  Top 3 Champions
                </span>
                <div className="flex justify-around gap-4">
                  {stats.topChamps &&
                    stats.topChamps.map((champ, index) => (
                      <div key={champ[0]} className="text-center">
                        <div className="text-2xl mb-2">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </div>
                        <p className="font-bold text-black dark:text-white">
                          {champ[0]}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {champ[1]} games
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <div
            className={`mt-8 transition-all duration-700 ${
              visibleStats >= 11
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>📸 Share Summary</>
              )}
            </button>
          </div>
        </div>

        <div
          className={`flex justify-between w-full transition-all duration-700 ${
            visibleStats >= 11
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={() => onNavigate("prev")}
            className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            ← Previous
          </button>
        </div>
      </main>

      {/* Hidden shareable card */}
      {showShareCard && (
        <div className="fixed left-[-9999px] top-0">
          <ShareableCard data={data} />
        </div>
      )}
    </div>
  );
}
