export default function PlayerRow({ player, isStriker, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-lg
        transition-all duration-300 cursor-pointer
        ${
          player.isOut
            ? "bg-red-50 border border-red-300 text-red-800 opacity-90"
            : isStriker
            ? "bg-green-50 border border-green-400"
            : "bg-white border border-gray-200"
        }
      `}
    >
      {/* LEFT: Name + Badges */}
      <div className="flex items-center gap-2">
        <span className="font-semibold">
          {player.name}
        </span>

        {player.isOut && (
          <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
            OUT
          </span>
        )}

        {!player.isOut && isStriker && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            STRIKER
          </span>
        )}
      </div>

      {/* RIGHT: Runs / Balls */}
      <div className="text-sm font-medium text-gray-700">
        {player.runs}
        <span className="text-gray-400"> ({player.balls})</span>
      </div>
    </div>
  );
}
