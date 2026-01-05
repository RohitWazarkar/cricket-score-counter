function TeamSummaryCard({ team }) {
  const totalRuns = team.players.reduce((sum, p) => sum + p.runs, 0);
  const totalBalls = team.players.reduce((sum, p) => sum + p.balls, 0);
  const wickets = team.players.filter(p => p.isOut).length;

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow">
      {/* Team Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">
          {team.name || "Team"}
        </h3>
        <span className="text-sm font-semibold text-gray-600">
          {totalRuns}/{wickets} ({Math.floor(totalBalls / 6)}.{totalBalls % 6})
        </span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 text-xs font-bold text-gray-500 border-b pb-1 mb-2">
        <span>Player</span>
        <span className="text-center">R</span>
        <span className="text-center">B</span>
        <span className="text-center">Status</span>
      </div>

      {/* Players */}
      {team.players.map(player => (
        <div
          key={player.id}
          className={`grid grid-cols-4 items-center text-sm py-1 rounded-lg
            ${player.isOut ? "bg-red-50" : "bg-green-50"}`}
        >
          <span className="truncate px-1">{player.name}</span>
          <span className="text-center font-semibold">{player.runs}</span>
          <span className="text-center">{player.balls}</span>
          <span
            className={`text-center font-semibold
              ${player.isOut ? "text-red-600" : "text-green-600"}`}
          >
            {player.isOut ? "Out" : "Not Out"}
          </span>
        </div>
      ))}
    </div>
  );
}
