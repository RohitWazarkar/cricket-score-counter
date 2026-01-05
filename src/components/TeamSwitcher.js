"use client";




export default function TeamSwitcher({
  currentTeam,
  runs,
  wickets,
  balls,
  players = [],
  strikerId,
  onSwitch
}) {
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;

  // Only two batsmen currently on field
  const striker = players.find(p => p.id === strikerId);
  const nonStriker = players.find(
    p => !p.isOut && p.balls > 0 && p.id !== strikerId
  );

  const currentBatsmen = [striker, nonStriker].filter(Boolean);

  return (
    <div className="bg-blue-100 text-blue-800
                    p-3 rounded-lg shadow mt-3 space-y-2">

      {/* TOP ROW */}
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-lg">
            {currentTeam}
          </div>
          <div className="text-sm text-blue-700">
            {runs}/{wickets} ({overs})
          </div>
        </div>

        <button
          onClick={onSwitch}
          className="bg-blue-600 hover:bg-blue-700
                     text-white px-4 py-1 rounded transition"
        >
          Switch
        </button>
      </div>

      {/* CURRENT BATSMEN */}
      {currentBatsmen.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {currentBatsmen.map(player => (
            <div
              key={player.id}
              className={`px-3 py-1 rounded-full text-sm
                flex items-center gap-1
                ${
                  player.id === strikerId
                    ? "bg-green-600 text-white"
                    : "bg-blue-200 text-blue-900"
                }
              `}
            >
              <span className="font-medium">{player.name}</span>
              <span className="text-xs">{player.runs} ({player.balls})</span>
              {player.id === strikerId && <span className="text-xs">🏏</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
