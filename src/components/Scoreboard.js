// pages/index.js or components/Scoreboard.js
import { useState } from "react";
import PlayerRow from "../components/PlayerRow";
import ScoreButtons from "../components/ScoreButtons";

export default function Scoreboard() {
  const [players, setPlayers] = useState([
    { name: "Player 1", runs: 0, balls: 0, ballHistory: [] }, // ✅ add ballHistory here
    { name: "Player 2", runs: 0, balls: 0, ballHistory: [] }, // ✅ add ballHistory here
  ]);

  const [strikerIndex, setStrikerIndex] = useState(0);

  const handleScore = (action) => {
    setPlayers((prev) => {
      const newPlayers = [...prev];
      const striker = { ...newPlayers[strikerIndex] };

      if (!["Wide", "No Ball"].includes(action)) {
        striker.balls += 1;
      }

      const runs = parseInt(action);
      if (!isNaN(runs)) {
        striker.runs += runs;
      }

      // add to ball history
      striker.ballHistory = [...striker.ballHistory, action];

      newPlayers[strikerIndex] = striker;
      return newPlayers;
    });
  };

  return (
    <div className="p-4">
      {players.map((player, index) => (
        <PlayerRow
          key={player.name}
          player={player}
          isStriker={index === strikerIndex}
        />
      ))}

      <ScoreButtons onAction={handleScore} />
    </div>
  );
}
