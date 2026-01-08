"use client";
import { useRef } from "react";

export default function ScoreButtons({ onAction }) {
  const containerRef = useRef(null);

  /* ---------- SOUND ---------- */
  function playClickSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 420; // soft tuk
    gain.gain.value = 0.05;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  /* ---------- BUBBLES ---------- */
  function createBubbles(count, button) {
    const rect = button.getBoundingClientRect();
    const container = containerRef.current;

    for (let i = 0; i < count; i++) {
      const bubble = document.createElement("span");
      bubble.className =
        "absolute w-2 h-2 rounded-full bg-blue-500 opacity-80 pointer-events-none";

      bubble.style.left = rect.left + rect.width / 2 + "px";
      bubble.style.top = rect.top + rect.height / 2 + "px";

      const angle = Math.random() * 2 * Math.PI;
      const distance = 30 + Math.random() * 20;

      bubble.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${
              Math.sin(angle) * distance
            }px) scale(0.5)`,
            opacity: 0
          }
        ],
        { duration: 400, easing: "ease-out" }
      );

      container.appendChild(bubble);
      setTimeout(() => bubble.remove(), 400);
    }
  }



  function handleAction(action, e) {
  playClickSound();

  const btn = e.currentTarget; // ✅ store DOM node safely

  if (btn) {
    btn.classList.add("animate-shake");

    setTimeout(() => {
      // ✅ btn still exists, no React pooling issue
      btn.classList.remove("animate-shake");
    }, 200);
  }

  if (!isNaN(action) && btn) {
    createBubbles(Number(action), btn);
  }

  onAction(action);
}

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t overflow-hidden"
    >
      {/* RUN BUTTONS */}
      <div className="grid grid-cols-5 gap-2">
        {["1", "2", "3", "4", "6"].map(run => (
          <button
            key={run}
            onClick={e => handleAction(run, e)}
            className="btn relative"
          >
            {run}
          </button>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-4 gap-2 mt-2">
        <button
          onClick={e => handleAction("Wide", e)}
          className="px-4 py-2 rounded-md bg-green-500 text-white"
        >
          ⬅️ Wide ➡️
        </button>

        <button
          onClick={e => handleAction("No Ball", e)}
          className="px-4 py-2 rounded-md bg-red-500 text-white"
        >
          🚫 No Ball
        </button>

        <button
          onClick={e => handleAction("Wicket", e)}
          className="px-4 py-2 rounded-md bg-red-900 text-white"
        >
          😔 Wicket
        </button>

        <button
          onClick={e => handleAction("Dot", e)}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white"
        >
          🟢 Dot Ball
        </button>

        <button
          onClick={e => handleAction("Undo", e)}
          className="px-4 py-2 rounded-md bg-amber-600 text-white"
        >
          ↙️ Undo
        </button>

     

      </div>

      {/* INLINE SHAKE ANIMATION */}
      <style jsx>{`
        .animate-shake {
          animation: shake 0.2s linear;
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
