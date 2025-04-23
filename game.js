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
    2: "#2a2", // trigger tile
  };

  function draw() {
    const tilemap = pyodide.globals.get("get_tilemap")().toJs();
    const pos = pyodide.globals.get("get_player_position")().toJs();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[0].length; x++) {
        ctx.fillStyle = colors[tilemap[y][x]];
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    // draw player
    ctx.fillStyle = "#4af";
    ctx.fillRect(pos.x * tileSize, pos.y * tileSize, tileSize, tileSize);
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
    }
  });

  draw();
}

main();
