let pyodide = null;

async function main() {
  pyodide = await loadPyodide();
  await pyodide.loadPackagesFromImports("main.py");
  await pyodide.runPythonAsync(await (await fetch("main.py")).text());

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 32;
  const colors = {
    0: "#222", // floor
    1: "#444", // wall
    2: "#2a2", // trigger
  };

  function draw() {
    const tilemap = pyodide.globals.get("get_tilemap")().toJs();
    const player = pyodide.globals.get("get_player_position")().toJs();
    const enemy = pyodide.globals.get("get_enemy_position")()?.toJs();
    const getStatus = pyodide.globals.get("get_status");
    const statusRaw = getStatus();
    const status = statusRaw.toJs ? statusRaw.toJs() : statusRaw;


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[0].length; x++) {
        ctx.fillStyle = colors[tilemap[y][x]];
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    // Draw player
    ctx.fillStyle = status.player_form === "normal" ? "#4af" : "#8f4";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);

    // Draw enemy
    if (enemy) {
      ctx.fillStyle = "#f44";
      ctx.fillRect(enemy.x * tileSize, enemy.y * tileSize, tileSize, tileSize);
    }

    // Draw health/status
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText(`HP: ${status.player_health} | Form: ${status.player_form}`, 10, canvas.height - 10);
  }

  document.addEventListener("keydown", (e) => {
  const moves = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };

  if (e.key in moves) {
    pyodide.globals.get("move_player")(...moves[e.key]);
    draw();
  } else if (e.key === " ") {
    pyodide.globals.get("attack")();
    draw();
  } else if (e.key.toLowerCase() === "t") {
    pyodide.globals.get("transform")();
    draw();
  }
});
