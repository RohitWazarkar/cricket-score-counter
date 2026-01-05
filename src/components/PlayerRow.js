"use client";

import { useState } from "react";

export default function PlayerRow({ player, isStriker, onClick }) {
  const [showSummary, setShowSummary] = useState(false);

  function handleRowClick() {
    if (player.isOut) {
      alert("Player already out");
      return;
    }
    onClick(player.id);
  }

  // Convert history object to display string
  function getBallDisplay(ballObj) {
    switch (ballObj.type) {
      case "Dot":
        return "0";
      case "Run":
        return ballObj.runs.toString();
      case "Wicket":
        return "W";
      case "Wide":
        return "Wd";
      case "No Ball":
        return "Nb";
      default:
        return "?";
    }
  }

  // Render ball emoji/text
  function renderBall(ball, index) {
    if (ball === "W") return <span key={index} className="text-red-600">❌</span>;
    if (ball === "0") return <span key={index} className="text-gray-500">•</span>;
    if (ball === "Wd" || ball === "Nb")
      return <span key={index} className="text-orange-600">{ball}</span>;
    if (ball === "4") return <span key={index}>4️⃣</span>;
    if (ball === "6") return <span key={index}>6️⃣</span>;
    return <span key={index}>{ball}</span>;
  }

  return (
    <>
      {/* PLAYER ROW */}
      <div
        onClick={handleRowClick}
        className={`p-3 rounded border transition
          grid grid-cols-[1fr_auto_1fr] items-center
          ${
            player.isOut
              ? "bg-black text-white opacity-70 cursor-not-allowed"
              : isStriker
              ? "border-green-600 bg-green-50 ring-2 ring-green-400 text-green-900"
              : "bg-white text-orange-600 hover:bg-orange-50"
          }
        `}
      >
        {/* LEFT : PLAYER NAME */}
        <span className="font-semibold truncate">
          {player.name}
          {isStriker && !player.isOut && (
            <span className="ml-2 text-green-600 text-sm">🏏</span>
          )}
          {player.isOut && (
            <span className="ml-2 text-red-400 text-sm">❌ Out</span>
          )}
        </span>

        {/* CENTER : SUMMARY BUTTON */}
        <button
          onClick={e => {
            e.stopPropagation();
            setShowSummary(true);
          }}
          className="mx-auto px-2 py-1 rounded
                     bg-blue-100 text-blue-700
                     hover:bg-blue-200 text-sm"
        >
          📊
        </button>

        {/* RIGHT : RUNS */}
        <span
          className={`text-sm text-right ${
            player.isOut ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {player.runs} ({player.balls})
        </span>
      </div>

      {/* SUMMARY MODAL */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-80 p-5 shadow-xl">
            <h2 className="text-xl font-bold text-center text-slate-800 mb-2">
              {player.name}
            </h2>

            <p className="text-center text-slate-600 mb-4">
              {player.runs} runs • {player.balls} balls
              {player.isOut && " • Out"}
            </p>

            {/* BALL HISTORY */}
            <div className="flex flex-wrap gap-2 justify-center mb-5 text-blue-600 text-lg">
              {player.history.length > 0 ? (
                player.history.map((h, index) => renderBall(getBallDisplay(h), index))
              ) : (
                <span className="text-gray-400">No balls faced</span>
              )}
            </div>

            <button
              onClick={() => setShowSummary(false)}
              className="w-full py-2 rounded-md
                         bg-blue-600 text-white
                         hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
