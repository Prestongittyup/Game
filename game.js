let pyodide = null;

async function main() {
  pyodide = await loadPyodide();
  await pyodide.loadPackagesFromImports("main.py");
  await pyodide.runPythonAsync(await (await fetch("main.py")).text());

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 32;
  const playerColor = "#4af";

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let pos = pyodide.globals.get("get_player_position")().toJs();
    ctx.fillStyle = playerColor;
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
