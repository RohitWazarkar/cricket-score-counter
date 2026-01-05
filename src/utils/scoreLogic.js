export function applyBall(player, action) {
  const updated = { ...player };

  if (!isNaN(action)) {
    updated.runs += Number(action);
    updated.balls += 1;
  } else if (action === "Dot") {
    updated.balls += 1;
  } else if (action === "Wicket") {
    updated.balls += 1;
    updated.isOut = true;
  }

  updated.history = [...updated.history, action];
  return updated;
}
