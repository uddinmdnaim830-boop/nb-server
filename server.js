const express = require("express");
const app = express();

app.use(express.json());

// in-memory data
let players = [];

// STATUS CHECK
app.get("/api/status", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

// APPLY PLAYER
app.post("/api/apply", (req, res) => {
  const { name, team, trx } = req.body;

  if (!name || !team || !trx) {
    return res.json({ ok: false, message: "Fill all fields" });
  }

  // duplicate transaction check
  let exist = players.find(p => p.trx === trx);
  if (exist) {
    return res.json({ ok: false, message: "Transaction already used" });
  }

  players.push({
    id: Date.now(),
    name,
    team,
    trx,
    status: "pending"
  });

  res.json({ ok: true, message: "Application submitted" });
});

// GET ACCEPTED PLAYERS
app.get("/api/players", (req, res) => {
  let accepted = players.filter(p => p.status === "accepted");
  res.json(accepted);
});

// SIMPLE ADMIN APPROVE (no auth for simplicity)
app.post("/api/admin/approve", (req, res) => {
  const { id } = req.body;

  let player = players.find(p => p.id == id);
  if (player) {
    player.status = "accepted";
    return res.json({ ok: true, message: "Player approved" });
  }

  res.json({ ok: false, message: "Player not found" });
});

// SERVER START
app.listen(process.env.PORT || 3000, () => {
  console.log("LIVE SERVER RUNNING");
});
