"use client";




export default function TeamSwitcher({
  currentTeam,
  runs,
  wickets,
  balls,
  players = [],
  strikerId,
  onSwitch , 
  totalOvers , 
  InningsNo
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
        <div className="flex items-center justify-center gap-3
                bg-white rounded-xl shadow-sm
                px-4 py-2 mt-2
                border border-blue-100">

  {/* Score */}
  <span className="text-lg font-bold text-blue-800">
    {runs}
    <span className="text-gray-500 text-sm font-medium">/{wickets}</span>
  </span>

  {/* Divider */}
  <span className="text-gray-300">|</span>

  {/* Overs */}
  <span className="text-sm font-semibold text-gray-700">
    {overs}
    <span className="text-gray-400 font-normal"> / {totalOvers} ov</span>
  </span>

  {/* Divider */}
  <span className="text-gray-300">|</span>

  {/* Innings */}
  <span className="text-sm font-semibold text-emerald-600">
    {InningsNo === 1 ? "1st Innings" : "2nd Innings"}
  </span>

</div>

        </div>

        <button
        id="TeamSwitchButton"
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
