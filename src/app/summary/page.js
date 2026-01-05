"use client";

import { useRouter } from "next/navigation";

export default function SummaryPage() {
  const router = useRouter();

  const match =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cricket-match"))
      : null;

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        No match data found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700
                      text-white rounded-2xl p-5 mb-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          🏏 Match Summary
        </h1>
      </div>

      <div className="space-y-6">
        <TeamBattingSummary team={match.teamA} />
        <TeamBattingSummary team={match.teamB} />

        <BowlerSummary
          bowlingTeam={match.teamA}
          title={`Bowling - ${match.teamA.name}`}
        />
        <BowlerSummary
          bowlingTeam={match.teamB}
          title={`Bowling - ${match.teamB.name}`}
        />
      </div>

      {/* OK BUTTON */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-4 left-4 right-4
                   bg-green-600 text-white py-3 rounded-xl
                   font-bold tracking-wide shadow-lg
                   hover:bg-green-700 active:scale-95 transition"
      >
        ✅ OK
      </button>
    </div>
  );
}

/* ================= BATSMAN SUMMARY ================= */

function TeamBattingSummary({ team }) {
  const totalRuns = team.players.reduce((s, p) => s + p.runs, 0);
  const totalBalls = team.players.reduce((s, p) => s + p.balls, 0);
  const wickets = team.players.filter(p => p.isOut).length;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      {/* TEAM HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-slate-800">
          {team.name} – Batting
        </h2>
        <span className="text-sm font-semibold text-slate-700">
          {totalRuns}/{wickets} ({Math.floor(totalBalls / 6)}.{totalBalls % 6})
        </span>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-11 text-xs font-bold text-slate-700 border-b pb-1 mb-2">
        <span>Player</span>
        <span className="text-center">1</span>
        <span className="text-center">2</span>
        <span className="text-center">3</span>
        <span className="text-center">4</span>
        <span className="text-center">6</span>
        <span className="text-center">Dot</span>
        <span className="text-center">R</span>
        <span className="text-center">B</span>
        <span className="text-center col-span-2">Status</span>
      </div>

      {/* PLAYERS */}
      {team.players.map(p => {
        const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 6: 0 };
        p.history.forEach(h => {
          if (!h.countsBall) return;
          if (h.type === "Dot") counts[0]++;
          if (h.type === "Run" && counts[h.runs] !== undefined) {
            counts[h.runs]++;
          }
        });

        return (
          <div
            key={p.id}
            className={`grid grid-cols-11 items-center text-sm py-1 rounded-lg
              ${p.isOut ? "bg-red-50" : "bg-green-50"}`}
          >
            <span className="px-1 font-medium text-slate-800 truncate">
              {p.name}
            </span>
            <span className="text-center">{counts[1]}</span>
            <span className="text-center">{counts[2]}</span>
            <span className="text-center">{counts[3]}</span>
            <span className="text-center font-semibold">{counts[4]}</span>
            <span className="text-center font-semibold">{counts[6]}</span>
            <span className="text-center">{counts[0]}</span>
            <span className="text-center font-bold">{p.runs}</span>
            <span className="text-center">{p.balls}</span>
            <span
              className={`col-span-2 text-center font-bold
                ${p.isOut ? "text-red-600" : "text-green-700"}`}
            >
              {p.isOut ? "OUT" : "NOT OUT"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ================= BOWLER SUMMARY ================= */

function BowlerSummary({ bowlingTeam, title }) {
  const bowlers = bowlingTeam.players.filter(p => p.ballLog.length > 0);

  if (!bowlers.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-bold text-slate-800 mb-3">
        🎯 {title}
      </h2>

      <div className="grid grid-cols-5 text-xs font-bold text-slate-700 border-b pb-1 mb-2">
        <span>Bowler</span>
        <span className="text-center">Overs</span>
        <span className="text-center">Runs</span>
        <span className="text-center">Wkts</span>
        <span className="text-center">Econ</span>
      </div>

      {bowlers.map(b => {
        const balls = b.ballLog.length;
        const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
        const wickets = b.history.filter(h => h.type === "Wicket").length;
        const econ = balls ? ((b.runs / balls) * 6).toFixed(1) : "0.0";

        return (
          <div
            key={b.id}
            className="grid grid-cols-5 items-center text-sm py-1 bg-slate-50 rounded-lg"
          >
            <span className="font-medium text-slate-800 truncate px-1">
              {b.name}
            </span>
            <span className="text-center font-bold text-red-600">{overs}</span>
            <span className="text-center font-bold text-red-600">{b.runs}</span>
            <span className="text-center font-bold text-red-600">
              {wickets}
            </span>
            <span className="text-center font-bold text-red-600">{econ}</span>
          </div>
        );
      })}
    </div>
  );
}
