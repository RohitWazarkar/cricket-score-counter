import PlayerRow from "./PlayerRow";

export default function PlayerList({
  players = [],
  strikerId,
  onSelectStriker
}) {

  return (
    <div className="h-64 overflow-y-auto space-y-2">
      {players.map(player => (
        <PlayerRow
          key={player.id}
          player={player}
          isStriker={player.id === strikerId}
          onClick={() => onSelectStriker(player.id)}
        />
      ))}
    </div>
  );
}
