const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore');

// 🎵 Audio setup
const foodSound = new Audio('https://kkd2202.github.io/snake-game/food.mp3');
const gameOverSound = new Audio('https://kkd2202.github.io/snake-game/gameover.mp3');
const musicSound = new Audio('https://kkd2202.github.io/snake-game/music.mp3');
musicSound.loop = true;
musicSound.volume = 0.3;

// 🐍 Game variables
const box = 30;
let snake = [{ x: 9, y: 9 }];
let direction = null;
let food = {
  x: Math.floor(Math.random() * 18),
  y: Math.floor(Math.random() * 18)
};
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreSpan.textContent = highScore;

// 🎮 Start screen state
let isGameRunning = false;

// 🎛 Input listener with improved music playback
document.addEventListener('keydown', (e) => {
  if (!isGameRunning) {
    isGameRunning = true;
    direction = 'RIGHT'; // Start moving right

    musicSound.load(); // Helps some browsers buffer the audio correctly
    musicSound.play().catch((err) => {
      console.log('Music playback failed:', err);
    });

    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (direction !== 'DOWN') direction = 'UP';
      break;
    case 'ArrowDown':
      if (direction !== 'UP') direction = 'DOWN';
      break;
    case 'ArrowLeft':
      if (direction !== 'RIGHT') direction = 'LEFT';
      break;
    case 'ArrowRight':
      if (direction !== 'LEFT') direction = 'RIGHT';
      break;
  }
});

// 🎯 Collision detection
function isCollision(head, body) {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

// 🎨 Start screen
function drawStartScreen() {
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '32px New Tegomin, serif';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over! Press any key to start', canvas.width / 2, canvas.height / 2);
}

// 🕹 Main draw loop
function draw() {
  if (!isGameRunning) {
    drawStartScreen();
    return;
  }

  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'red' : 'purple';
    ctx.fillRect(segment.x * box, segment.y * box, box, box);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(segment.x * box, segment.y * box, box, box);
  });

  ctx.fillStyle = 'yellow';
  ctx.fillRect(food.x * box, food.y * box, box, box);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(food.x * box, food.y * box, box, box);

  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  if (
    head.x < 0 || head.x >= canvas.width / box ||
    head.y < 0 || head.y >= canvas.height / box ||
    isCollision(head, snake)
  ) {
    gameOverSound.play();
    musicSound.pause();
    isGameRunning = false;
    snake = [{ x: 9, y: 9 }];
    direction = null;
    score = 0;
    scoreSpan.textContent = score;
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    foodSound.play();
    score++;
    scoreSpan.textContent = score;
    food = {
      x: Math.floor(Math.random() * 18),
      y: Math.floor(Math.random() * 18)
    };
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreSpan.textContent = highScore;
    }
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

// ⏱ Game loop
setInterval(draw, 100);
