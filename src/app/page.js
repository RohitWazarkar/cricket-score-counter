"use client";


import useLocalStorage from "@/hooks/useLocalStorage";

import Header from "@/components/Header";
import PlayerList from "@/components/PlayerList";
import ScoreButtons from "@/components/ScoreButtons";
import TeamSwitcher from "@/components/TeamSwitcher";
import { useEffect, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

import AlertBox from "@/components/AlertBox";



const initialState = {
  currentTeam: "A",
   totalOvers: 0, 
   InningsNo : 1 , 
  teamA: {
    name: "Team A",
    isInningsDone: false,
    players: []
  },
  teamB: {
    name: "Team B",
    isInningsDone: false,
    players: []
  }
};





export default function Home() {
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [wideRunsAllowed] = useState(true);
  const [inningsStartTime, setInningsStartTime] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [match, setMatch] = useLocalStorage("cricket-match", initialState);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [strikerId, setStrikerId] = useLocalStorage("cricket-striker", null);


  const [showBowlerForm, setShowBowlerForm] = useState(false);
const [bowlerName, setBowlerName] = useState(""); // input field
const [selectedBowlerId, setSelectedBowlerId] = useState(null);
const [currentBowler, setCurrentBowler] = useState(null);

const router = useRouter();

const [alertData, setAlertData] = useState({
  show: false,
  message: "",
  mode: "warning"
});


function showAlert(message, mode = "warning") {
  setAlertData({
    show: true,
    message,
    mode
  });
}

function closeAlert() {
  setAlertData(prev => ({ ...prev, show: false }));
}





  

 // const activeTeam = match.currentTeam === "A" ? match.teamA : match.teamB;


  const activeTeam =
  match.currentTeam === "A" ? match.teamA : match.teamB;

const oppositeTeam =
  match.currentTeam === "A" ? match.teamB : match.teamA;


  useEffect(() => {
    setMounted(true);
  }, []);

  // Load match & inningsStartTime from localStorage safely
  useEffect(() => {
    if (!mounted) return;

    const savedMatch = localStorage.getItem("cricket-match");
    const savedTime = localStorage.getItem("inningsStartTime");

    // showAlert("Welcome to our app 😊", "success");


    if (savedTime) setInningsStartTime(savedTime);

    if (!savedMatch) {
      setShowMatchForm(true); // First time
    } else {
      try {
        const parsed = JSON.parse(savedMatch);
        if (
          !parsed.teamA.name ||
          !parsed.teamB.name ||
          (parsed.teamA.players.length === 0 && parsed.teamB.players.length === 0)
        ) {
          setShowMatchForm(true);
        }
      } catch {
        setShowMatchForm(true);
      }
    }
  }, [mounted]);

  // Persist match state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cricket-match", JSON.stringify(match));
    }
  }, [match, mounted]);

  function getNextBallNumber(balls) {
    const over = Math.floor(balls / 6);
    const ball = (balls % 6) + 1;
    return Number(`${over}.${ball}`);
  }


  
  function endInnings() {
  const teamKey = match.currentTeam === "A" ? "teamA" : "teamB";
  const otherTeamKey = teamKey === "teamA" ? "teamB" : "teamA";

  match.InningsNo = 2 ; 

  // Prevent double end
  if (match[teamKey].isInningsDone) {
   
    showAlert("This innings is already completed", "warning");
    return;
  }

  setMatch({
    ...match,
    [teamKey]: {
      ...match[teamKey],
      isInningsDone: true
    },
    currentTeam: teamKey === "teamA" ? "B" : "A"
  });

  setStrikerId(null);
}




  function resetMatch() {
    if (!confirm("Are you sure you want to reset the match?")) return;

    setMatch(initialState);
    setStrikerId(null);

    localStorage.removeItem("cricket-match");
    localStorage.removeItem("cricket-striker");
    localStorage.removeItem("inningsStartTime");

    setShowMatchForm(true);
    setInningsStartTime(null);
  }

  function addPlayerToTeam() {
    if (!playerName.trim()) return;

    if (!inningsStartTime) {
      const now = new Date().toLocaleString();
      setInningsStartTime(now);
      localStorage.setItem("inningsStartTime", now);
    }

    const teamKey = match.currentTeam === "A" ? "teamA" : "teamB";

    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    const newPlayer = {
      id: generateId(),
      name: playerName,
      runs: 0,
      balls: 0,
      isOut: false,
      history: [],
      ballLog: []
    };
    match.InningsNo = 1 ; 

    setMatch({
      ...match,
      [teamKey]: {
        ...match[teamKey],
        players: [...match[teamKey].players, newPlayer]
      }
    });

    setPlayerName("");
    setShowAddPlayer(false);
  }

  function getRunFrequency(players) {
    const freq = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 6: 0 };
    players.forEach(player => {
      player.history.forEach(h => {
        if (!h.countsBall) return;
        if (h.type === "Dot") freq[0]++;
        else if (h.type === "Run" && freq[h.runs] !== undefined) {
          freq[h.runs]++;
        }
      });
    });
    return freq;
  }
function downloadScorecardPDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  doc.setFont("helvetica");
  doc.setFontSize(10);

  let y = 10;
  doc.setFontSize(14);
  doc.text("Cricket Match Scorecard", 105, y, { align: "center" });
  y += 6;
  doc.setFontSize(9);
  doc.text(`Innings Started: ${inningsStartTime || "N/A"}`, 105, y, { align: "center" });
  y += 4;
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, y, { align: "center" });
  y += 8;

  const drawTeamTable = (team) => {
    doc.setFontSize(11);
    doc.text(team.name, 14, y);
    y += 2;

    const bodyData = team.players.map((p, i) => {
      // Count frequencies for this player
      const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 6: 0 };
      p.history.forEach(h => {
        if (!h.countsBall) return;
        if (h.type === "Dot") counts[0]++;
        else if (h.type === "Run" && counts[h.runs] !== undefined) counts[h.runs]++;
      });

      return [
        i + 1,
        p.name,
        counts[1],
        counts[2],
        counts[3],
        counts[4],
        counts[6],
        counts[0],
        p.runs,
        p.balls,
        p.isOut ? "OUT" : "NOT OUT"
      ];
    });

    autoTable(doc, {
      startY: y,
      theme: "grid",
      styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, cellPadding: 2 },
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: "bold" },
      head: [["#", "Player", "1", "2", "3", "4", "6", "Dot", "Runs", "Balls", "Status"]],
      body: bodyData
    });

    y = doc.lastAutoTable.finalY + 6;
  };

  drawTeamTable(match.teamA);
  drawTeamTable(match.teamB);

  // Optional: Overall Run Frequency table (can keep or remove)
  const freq = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 6: 0 };
  [...match.teamA.players, ...match.teamB.players].forEach(player => {
    player.history.forEach(h => {
      if (!h.countsBall) return;
      if (h.type === "Dot") freq[0]++;
      if (h.type === "Run" && freq[h.runs] !== undefined) freq[h.runs]++;
    });
  });

  doc.setFontSize(11);
  doc.text("Run Frequency (Ball-wise)", 14, y);
  y += 2;
  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, cellPadding: 2 },
    headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: "bold" },
    head: [["Run Type", "Frequency"]],
    body: [["Dot (0)", freq[0]], ["1 Run", freq[1]], ["2 Runs", freq[2]], ["3 Runs", freq[3]], ["4 Runs", freq[4]], ["6 Runs", freq[6]]]
  });

  doc.setFontSize(8);
  doc.text("Generated by Cricket Score Counter", 105, 290, { align: "center" });
  doc.save("cricket-scorecard.pdf");
}



  function resetPlayerRunsOnly() {
    if (!confirm("Reset runs and balls for all players?")) return;
    const teamKey = match.currentTeam === "A" ? "teamA" : "teamB";
    const updatedPlayers = match[teamKey].players.map(player => ({
      ...player,
      runs: 0,
      balls: 0,
      isOut: false,
      history: [],
      ballLog: []
    }));
    setMatch({ ...match, [teamKey]: { ...match[teamKey], players: updatedPlayers } });
    setStrikerId(null);
  }

  // function handleScoreAction(action) {
  //   const teamKey = match.currentTeam === "A" ? "teamA" : "teamB";
  //   const players = [...match[teamKey].players];


  // const activeBatsmen = players.filter(p => !p.isOut);
  // if (activeBatsmen.length < 2) {
  //   alert("Two batsmen are required to continue the match");
  //   return;
  // }


  //   if (action === "Undo") {
  //     if (!strikerId) return;
  //     const index = players.findIndex(p => p.id === strikerId);
  //     if (index === -1) return;
  //     const player = { ...players[index] };
  //     const last = player.history.pop();
  //     if (!last) return;
  //     player.runs -= last.runs || 0;
  //     if (last.countsBall) {
  //       player.balls -= 1;
  //       player.ballLog.pop();
  //     }
  //     if (last.type === "Wicket") player.isOut = false;
  //     players[index] = player;
  //     setMatch({ ...match, [teamKey]: { ...match[teamKey], players } });
  //     return;
  //   }

  //   if (!strikerId) return;
  //   const strikerIndex = players.findIndex(p => p.id === strikerId && !p.isOut);
  //   if (strikerIndex === -1) return;
  //   const striker = { ...players[strikerIndex] };

  //   if (!isNaN(action)) {
  //     const runs = Number(action);
  //     striker.runs += runs;
  //     striker.balls += 1;
  //     striker.ballLog.push(getNextBallNumber(striker.balls - 1));
  //     striker.history.push({ type: "Run", runs, countsBall: true });
  //   } else if (action === "Dot") {
  //     striker.balls += 1;
  //     striker.ballLog.push(getNextBallNumber(striker.balls - 1));
  //     striker.history.push({ type: "Dot", runs: 0, countsBall: true });
  //   } else if (action === "Wicket") {
  //     striker.balls += 1;
  //     striker.isOut = true;
  //     striker.ballLog.push(getNextBallNumber(striker.balls - 1));
  //     striker.history.push({ type: "Wicket", runs: 0, countsBall: true });
  //   } else if (action === "Wide" || action === "No Ball") {
  //     const runs = wideRunsAllowed ? 1 : 0;
  //     striker.runs += runs;
  //     striker.history.push({ type: action, runs, countsBall: false });
  //   }

  //   players[strikerIndex] = striker;
  //   setMatch({ ...match, [teamKey]: { ...match[teamKey], players } });
  // }


  function getActiveBatsmen(players) {
  return players.filter(p => !p.isOut);
}

function getNonStrikerId(players, strikerId) {
  const batsmen = getActiveBatsmen(players);
  if (batsmen.length < 2) return null;
  return batsmen.find(p => p.id !== strikerId)?.id || null;
}

function switchStrike(players, strikerId, setStrikerId) {
  const nonStrikerId = getNonStrikerId(players, strikerId);
  if (nonStrikerId) {
    setStrikerId(nonStrikerId);
  }
}


function handleScoreAction(action) {
  const teamKey = match.currentTeam === "A" ? "teamA" : "teamB";


  if (match[teamKey].isInningsDone) {
    //alert("This innings is completed. Please switch to next team.");
    showAlert("This innings is completed. Please switch to next team.", "warning");
    return;
  }


  if(teamBalls  > match.totalOvers * 6 ){
   // alert('Cant add runs now need to switch the team !') ; 
    showAlert("Cant add runs now need to switch the team !", "warning");
      const btn = document.getElementById("TeamSwitchButton");
  btn?.focus();
    return ; 
  }



  const players = [...match[teamKey].players];

  const activeBatsmen = players.filter(p => !p.isOut);
  if (activeBatsmen.length < 2) {
    // alert("Two batsmen are required to continue the match");
    showAlert("Two batsmen are required to continue the match", "warning");

    return;
  }

  if (!strikerId) {
    // alert("Please select a striker");
    showAlert("Please select a striker", "warning");
    return;
  }

  const strikerIndex = players.findIndex(
    p => p.id === strikerId && !p.isOut
  );
  if (strikerIndex === -1) return;

  const striker = { ...players[strikerIndex] };

  let legalBall = false;
  let runsScored = 0;

  /* ---------- ACTION HANDLING ---------- */

  if (!isNaN(action)) {
    runsScored = Number(action);
    legalBall = true;

    striker.runs += runsScored;
    striker.balls += 1;
    striker.ballLog.push(getNextBallNumber(striker.balls - 1));
    striker.history.push({ type: "Run", runs: runsScored, countsBall: true });
  }



  else if (action === "Dot") {
    legalBall = true;

    striker.balls += 1;
    striker.ballLog.push(getNextBallNumber(striker.balls - 1));
    striker.history.push({ type: "Dot", runs: 0, countsBall: true });
  }

  else if (action === "Wicket") {
    legalBall = true;

    striker.balls += 1;
    striker.isOut = true;
    striker.ballLog.push(getNextBallNumber(striker.balls - 1));
    striker.history.push({ type: "Wicket", runs: 0, countsBall: true });
  }



 else if (action === "Wide" || action === "No Ball") {
  const input = prompt(
    `${action} runs? (Enter 1, 2, 3, 4, 5, or 6)  \n Can Set Strike Manually !`,
    "1"
  );

  const runs = Number(input);

  if (![1, 2, 3, 4, 5, 6].includes(runs)) {
    //alert("Invalid runs. Please enter 1, 2, 3, 4, 5 or 6.");
    showAlert("Invalid runs. Please enter 1, 2, 3, 4, 5 or 6.", "danger");
    return;
  }

  striker.runs += runs;
  teamRuns += runs;

  striker.history.push({
    type: action,
    runs,
    countsBall: false
  });
}




  
  if (action === "Undo") {
  if (!strikerId) return;

  const index = players.findIndex(p => p.id === strikerId);
  if (index === -1) return;

  const player = { ...players[index] };
  const last = player.history.pop();
  if (!last) return;

  // Restore runs
  player.runs -= last.runs || 0;




  // Restore ball
  if (last.countsBall) {
    player.balls -= 1;
    player.ballLog.pop();
  }

  // Restore wicket
  if (last.type === "Wicket") {
    player.isOut = false;
  }

  players[index] = player;

  // 🔥 Restore previous striker
  if (last.prevStrikerId) {
    setStrikerId(last.prevStrikerId);
  }

  setMatch({
    ...match,
    [teamKey]: {
      ...match[teamKey],
      players
    }
  });

 // alert('Undo Status Successfully ! \n  Please Select Strike Manually !') ;
  showAlert('Undo Status Successfully ! \n  Please Select Strike Manually !','success') ;


  return;
}

  

  players[strikerIndex] = striker;

  /* ---------- STRIKE CHANGE RULES ---------- */

  // Change strike on odd runs (1,3)
  if (legalBall && [1, 3].includes(runsScored)) {
    switchStrike(players, strikerId, setStrikerId);
  }

  // Wicket → next batsman comes on strike
  if (action === "Wicket") {
    const nextBatsman = players.find(p => !p.isOut && p.id !== strikerId);
    if (nextBatsman) {
      setStrikerId(nextBatsman.id);
    }
  }

  /* ---------- OVER END STRIKE CHANGE ---------- */

  const totalBalls =
    players.reduce((sum, p) => sum + p.balls, 0);

  if (legalBall && totalBalls % 6 === 0) {
    switchStrike(players, strikerId, setStrikerId);
  }

  setMatch({ ...match, [teamKey]: { ...match[teamKey], players } });



  
}


  var teamRuns = activeTeam.players.reduce((sum, p) => sum + p.runs, 0);
  const teamWickets = activeTeam.players.filter(p => p.isOut).length;
  const teamBalls = activeTeam.players.reduce((sum, p) => sum + p.balls, 0);


  useEffect(() => {
  if (!activeTeam.players.length) return;

  if (teamBalls > 0 && teamBalls % 6 === 0) {
    setShowBowlerForm(true);
  }
}, [teamBalls]);


  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-100 p-3 md:p-6">
      {/* <Header /> */}
<div className="relative flex items-center justify-between">
{showMatchForm && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-white to-blue-50
                    rounded-2xl p-6 w-80 space-y-5
                    shadow-2xl border border-blue-100">

      {/* Title */}
      <h2 className="text-xl font-bold text-center text-blue-800">
        🏏 Start Match
      </h2>

      {/* Team A */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Team A Name
        </label>
        <input
          type="text"
          placeholder="Enter Team A"
          className="w-full border border-blue-300 px-3 py-2 rounded-lg
                     text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={match.teamA.name}
          onChange={e =>
            setMatch(m => ({
              ...m,
              teamA: { ...m.teamA, name: e.target.value }
            }))
          }
        />
      </div>

      {/* VS */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span
          className="px-4 py-1 rounded-full text-sm font-bold
                     bg-blue-700 text-white tracking-widest shadow"
        >
          VS
        </span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Team B */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Team B Name
        </label>
        <input
          type="text"
          placeholder="Enter Team B"
          className="w-full border border-blue-300 px-3 py-2 rounded-lg
                     text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={match.teamB.name}
          onChange={e =>
            setMatch(m => ({
              ...m,
              teamB: { ...m.teamB, name: e.target.value }
            }))
          }
        />
      </div>

          {/* Overs */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Total Overs
  </label>
  <input
    type="number"
    min="1"
    placeholder="Enter overs (e.g. 20)"
    className="w-full border border-blue-300 px-3 py-2 rounded-lg
               text-gray-900
               focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={match.totalOvers || ""}
    onChange={e =>
      setMatch(m => ({
        ...m,
        totalOvers: Number(e.target.value)
      }))
    }
  />
</div>



      {/* Start Button */}
      <button
        onClick={() => setShowMatchForm(false)}
       disabled={
    !match.teamA.name ||
    !match.teamB.name ||
    !match.totalOvers ||
    match.totalOvers <= 0
  }
        className="w-full py-2.5 rounded-xl font-semibold
                   bg-blue-600 text-white tracking-wide
                   hover:bg-blue-700 active:scale-95
                   transition-all duration-200
                   disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
      >
        🚀 Start Match
      </button>
    </div>
  </div>
)}

{showBowlerForm && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div className="bg-gradient-to-br from-white to-blue-50
                    rounded-2xl w-80 p-6 shadow-2xl border">

      <h2 className="text-xl font-bold text-center mb-5 text-blue-800">
        🎯 Select Bowler for Next Over
      </h2>

      {/* Dropdown */}
      <label className="block mb-1 text-sm font-semibold text-gray-700">
        Choose Existing Bowler
      </label>

      <select
        value={selectedBowlerId || ""}
        onChange={e => setSelectedBowlerId(e.target.value)}
        className="w-full mb-4 border border-blue-300 rounded-lg
                   px-3 py-2 text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Bowler --</option>
        {oppositeTeam.players.map(player => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 my-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* New Bowler Input */}
      <label className="block mb-1 text-sm font-semibold text-gray-700">
        Add New Bowler
      </label>

      <input
        type="text"
        placeholder="Enter bowler name"
        value={bowlerName}
        onChange={e => setBowlerName(e.target.value)}
        className="w-full border border-blue-300 rounded-lg
                   px-3 py-2 mb-5 text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={() => {
          if (selectedBowlerId) {
            setCurrentBowler(selectedBowlerId);
          } else if (bowlerName.trim()) {
            const newBowler = {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2),
              name: bowlerName.trim(),
              runs: 0,
              balls: 0,
              isOut: false,
              history: [],
              ballLog: []
            };

            const teamKey = match.currentTeam === "A" ? "teamB" : "teamA";

            setMatch({
              ...match,
              [teamKey]: {
                ...match[teamKey],
                players: [...match[teamKey].players, newBowler]
              }
            });

            setCurrentBowler(newBowler.id);
          }

          setBowlerName("");
          setSelectedBowlerId(null);
          setShowBowlerForm(false);
        }}
        className="w-full py-2.5 rounded-xl font-semibold
                   bg-blue-600 text-white
                   hover:bg-blue-700 active:scale-95
                   transition-all duration-200 shadow-md"
      >
        ✅ Confirm Bowler
      </button>
    </div>
  </div>
)}



  {showMenu && (
  <>
    <div
      className="fixed inset-0 bg-black/30 z-40"
      onClick={() => setShowMenu(false)}
    />

    <div
      className="fixed top-0 left-0 z-50 h-full w-72
                 bg-white shadow-2xl
                 transform transition-transform duration-300
                 translate-x-0"
    >
      <div className="px-5 py-4 border-b text-gray-800 font-semibold">
        Match Options
      </div>


      <div className="p-3 space-y-2">
        <button
          onClick={() => {
            resetMatch();
            setShowMenu(false);
          }}
          className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl"
        >
          🔄 Reset Match All
        </button>
        

        <button
  onClick={() => {
    downloadScorecardPDF();
    setShowMenu(false);
  }}
  className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-xl"
>
  📄 Download Scorecard (PDF)
</button>


         


        <button
  onClick={() => {
    resetPlayerRunsOnly();
    setShowMenu(false);
  }}
  className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl"
>
  🔄 Reset Player Runs Only
</button>


    <button
  onClick={() => {
    localStorage.setItem("match", JSON.stringify(match));
    router.push("/summary");
    setShowMenu(false);
  }}
  className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl"
>
  📊 View Full Match Summary
</button>

 <button
  onClick={endInnings}
  className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl"
>
  🔚 End Of Inning 🔚
</button>



  





      </div>
    </div>
  </>
)}

  
  {/* Menu Button */}
  <button
    onClick={() => setShowMenu(prev => !prev)}
    className="p-2 rounded-md hover:bg-blue-100 transition z-20"
  >
    <div className="space-y-1">
      <span className="block w-6 h-0.5 bg-blue-800"></span>
      <span className="block w-6 h-0.5 bg-blue-800"></span>
      <span className="block w-6 h-0.5 bg-blue-800"></span>
    </div>
  </button>

  {/* Center Title */}
  <h1 className="absolute left-1/2 -translate-x-1/2
                 text-2xl font-bold text-blue-800 whitespace-nowrap z-10">
    Cricket Score Counter
  </h1>

</div>




      {/* Team Switch */}
    <TeamSwitcher
  currentTeam={activeTeam.name}
  runs={teamRuns}
  wickets={teamWickets}
  balls={teamBalls}
  players={activeTeam.players}
  strikerId={strikerId}
  totalOvers={match.totalOvers} 
  InningsNo ={match.InningsNo }
  onSwitch={() =>
    setMatch({
      ...match,
      currentTeam: match.currentTeam === "A" ? "B" : "A"
    })
  }
/>

<div className="flex justify-center mt-2">
  <button
    onClick={() => setShowAddPlayer(true)}
    className="px-4 py-2 bg-green-700 text-white rounded-md"
  >
    ➕ Add Player
  </button>
</div>





      <p className="text-center mt-2">
        Current Team: {activeTeam.name}
      </p>

      {/* Player List */}
    
    <PlayerList
  players={activeTeam.players}
  strikerId={strikerId}
  onSelectStriker={setStrikerId}
/>

{showAddPlayer && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-80 p-5 shadow-xl">
      <h2 className="text-xl font-bold text-center text-slate-800">
        ➕ Add Player
      </h2>

      {/* Player Name */}
      <label className="text-sm font-medium text-slate-600">
        Player Name
      </label>
      <input
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
        className="w-full mt-1 mb-4 border border-slate-300 p-2 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   text-slate-800 placeholder:text-slate-400"
      />

      {/* Team Name (Readonly) */}
      <label className="text-sm font-medium text-slate-600">
        Team
      </label>
      <input
        type="text"
        value={activeTeam.name}
        readOnly
        className="w-full mt-1 mb-5 border border-slate-200 p-2 rounded-md
                   bg-slate-100 text-slate-500 cursor-not-allowed"
      />

      <div className="flex justify-between">
        <button
          onClick={() => setShowAddPlayer(false)}
          className="px-4 py-2 rounded-md
                     bg-slate-200 text-slate-700
                     hover:bg-slate-300 transition"
        >
          Cancel
        </button>

        <button
          onClick={addPlayerToTeam}
          className="px-4 py-2 rounded-md
                     bg-blue-600 text-white
                     hover:bg-blue-700 transition"
        >
          Add Player
        </button>
      </div>
    </div>
  </div>
)}







     


      {/* Score Buttons */}
     <ScoreButtons onAction={handleScoreAction} />

      

{alertData.show && (
  <AlertBox
    message={alertData.message}
    mode={alertData.mode}
    onClose={closeAlert}
  />
)}


    
    </main>
  );
}

/*


*/