const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game Objects
const user = { x: 10, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0, dy: 0 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 5, dx: 5, dy: 5 };

// Draw Rectangles (Paddles)
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Draw Circle (Ball)
function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// Draw Text (Score)
function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "32px sans-serif";
  ctx.fillText(text, x, y);
}

// Listen for keys
document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") user.dy = -6;
  if (e.key === "s" || e.key === "ArrowDown") user.dy = 6;
});

document.addEventListener("keyup", (e) => {
  if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) user.dy = 0;
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

// Update game mechanics
function update() {
  // Move player paddle
  user.y += user.dy;
  user.y = Math.max(0, Math.min(canvas.height - user.height, user.y));

  // Simple AI movement
  ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.08;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top/Bottom collision
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy = -ball.dy;
  }

  // Check paddle collision
  let player = (ball.x < canvas.width / 2) ? user : ai;
  if (collision(ball, player)) {
    ball.dx = -ball.dx;
  }

  // Score keeping
  if (ball.x - ball.radius < 0) {
    ai.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}

// Render loop
function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawText(user.score, canvas.width / 4, 50);
  drawText(ai.score, (3 * canvas.width) / 4, 50);
  drawRect(user.x, user.y, user.width, user.height, "#FFF");
  drawRect(ai.x, ai.y, ai.width, ai.height, "#FFF");
  drawArc(ball.x, ball.y, ball.radius, "#FFF");
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
