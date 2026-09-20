const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game Objects
const user = { x: 10, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0, dy: 0 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 5, dx: 5, dy: 5 };

// In-Game Community Links (Coordinates on Canvas)
const links = [
  { text: "🐙 GitHub", url: "https://github.com/vruntime-labs", x: 120, y: 380, w: 90, h: 20 },
  { text: "📸 Instagram", url: "https://www.instagram.com/vruntimelabs/", x: 250, y: 380, w: 100, h: 20 },
  { text: "🎥 YouTube", url: "https://www.youtube.com/@vruntimelabs", x: 380, y: 380, w: 90, h: 20 }
];

// Draw Rectangles
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Draw Circle
function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// Draw Text
function drawText(text, x, y, size = "32px", color = "#FFF") {
  ctx.fillStyle = color;
  ctx.font = `${size} sans-serif`;
  ctx.fillText(text, x, y);
}

// Keyboard Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") user.dy = -6;
  if (e.key === "s" || e.key === "ArrowDown") user.dy = 6;
});

document.addEventListener("keyup", (e) => {
  if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) user.dy = 0;
});

// Touch Controls for Mobile
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");

upBtn.addEventListener("touchstart", (e) => { e.preventDefault(); user.dy = -6; });
upBtn.addEventListener("touchend", (e) => { e.preventDefault(); user.dy = 0; });
downBtn.addEventListener("touchstart", (e) => { e.preventDefault(); user.dy = -6; });
downBtn.addEventListener("touchend", (e) => { e.preventDefault(); user.dy = 0; });

upBtn.addEventListener("mousedown", () => user.dy = -6);
upBtn.addEventListener("mouseup", () => user.dy = 0);
downBtn.addEventListener("mousedown", () => user.dy = 6);
downBtn.addEventListener("mouseup", () => user.dy = 0);

// Canvas Link Click Detection
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  links.forEach(link => {
    if (mouseX >= link.x && mouseX <= link.x + link.w &&
        mouseY >= link.y - 15 && mouseY <= link.y + 5) {
      window.open(link.url, "_blank");
    }
  });
});

// Collision Detection
function collision(b, p) {
  return b.x - b.radius < p.x + p.width &&
         b.x + b.radius > p.x &&
         b.y - b.radius < p.y + p.height &&
         b.y + b.radius > p.y;
}

// Reset Ball
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
  ball.speed = 5;
}

// Update Game Logic
function update() {
  user.y += user.dy;
  user.y = Math.max(0, Math.min(canvas.height - user.height, user.y));

  ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.08;

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height - 30) {
    ball.dy = -ball.dy;
  }

  let player = (ball.x < canvas.width / 2) ? user : ai;
  if (collision(ball, player)) {
    ball.dx = -ball.dx;
  }

  if (ball.x - ball.radius < 0) {
    ai.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}

// Render Graphics & UI
function render() {
  // Clear Screen
  drawRect(0, 0, canvas.width, canvas.height, "#000");

  // Draw Scores
  drawText(user.score, canvas.width / 4, 50);
  drawText(ai.score, (3 * canvas.width) / 4, 50);

  // Draw Paddles & Ball
  drawRect(user.x, user.y, user.width, user.height, "#FFF");
  drawRect(ai.x, ai.y, ai.width, ai.height, "#FFF");
  drawArc(ball.x, ball.y, ball.radius, "#FFF");

  // Draw Divider Line
  drawRect(canvas.width / 2 - 1, 0, 2, canvas.height - 30, "#333");

  // Draw Bottom Bar for In-Game Community Links
  drawRect(0, canvas.height - 30, canvas.width, 30, "#1e293b");
  links.forEach(link => {
    drawText(link.text, link.x, link.y, "14px", "#38bdf8");
  });
}

// Game Loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
