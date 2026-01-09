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

  // Render ball UI
  function renderBall(ball, index) {
    if (ball === "W")
      return <span key={index} className="text-red-600">❌</span>;
    if (ball === "0")
      return <span key={index} className="text-gray-500">•</span>;
    if (ball === "Wd" || ball === "Nb")
      return <span key={index} className="text-orange-600">{ball}</span>;
    if (ball === "4")
      return <span key={index}>4️⃣</span>;
    if (ball === "6")
      return <span key={index}>6️⃣</span>;
    return <span key={index}>{ball}</span>;
  }

  return (
    <>
      {/* PLAYER ROW */}
      <div
        onClick={handleRowClick}
        className={`p-3 rounded-lg border transition
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
          onClick={(e) => {
            e.stopPropagation();
            setShowSummary(true);
          }}
          title="View player summary"
          className="
            mx-auto w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-blue-500/10 text-blue-700
            hover:bg-blue-500/20
            active:scale-95
            transition
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
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
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowSummary(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white rounded-2xl w-80 p-6
              shadow-2xl
              animate-[fadeIn_0.25s_ease-out]
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-slate-800">
                {player.name}
              </h2>

              <button
                onClick={() => setShowSummary(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✖
              </button>
            </div>

            {/* STATS */}
            <p className="text-center text-slate-600 mb-4">
              <span className="font-semibold text-slate-800">
                {player.runs}
              </span>{" "}
              runs •{" "}
              <span className="font-semibold text-slate-800">
                {player.balls}
              </span>{" "}
              balls
              {player.isOut && (
                <span className="ml-2 text-red-500 font-medium">
                  Out
                </span>
              )}
            </p>

            {/* BALL HISTORY */}
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {player.history.length > 0 ? (
                player.history.map((h, index) => (
                  <span
                    key={index}
                    className="
                      px-2 py-1 rounded-full text-sm
                      bg-slate-100 text-slate-700
                      shadow-sm
                    "
                  >
                    {renderBall(getBallDisplay(h), index)}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">
                  No balls faced
                </span>
              )}
            </div>

            {/* OK BUTTON */}
            <button
              onClick={() => setShowSummary(false)}
              className="
                w-full py-2 rounded-lg
                bg-blue-600 text-white font-semibold
                hover:bg-blue-700
                transition
              "
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
