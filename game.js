const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

let player = {
    speed: 2,
    jump: 10,
    gravity: 0.3,
    onGround: false,
    x: 100,
    y: 0,
    w: 30,
    h: 15,
    vy: 0,
    lastOnGround: true
};

const baseScrollSpeed = 0.8;
let scrollSpeed = baseScrollSpeed;
let platforms = [];

let stars = [];
for (let i = 0; i < 100; i++) {
    stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 });
}

let score = 0;
let highScore = 0;
let gameRunning = false;

function initPlatforms() {
    platforms = [
        { x: 50, width: 200, y: 350 },
        { x: 300, width: 150, y: 350 },
        { x: 600, width: 250, y: 350 },
        { x: 950, width: 200, y: 350 },
        { x: 1300, width: 120, y: 350 }
    ];
    player.y = platforms[0].y - player.h;
    player.vy = 0;
    player.onGround = true;
    player.lastOnGround = true;
    score = 0;
}

function drawStars() {
    ctx.fillStyle = "white";
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawTitle() {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 20;
    ctx.font = "28px Arial";
    ctx.textAlign = "left";
    ctx.fillText("SpaceRoad - MiniGame", 20, 40);
    ctx.restore();
}

function drawScore() {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 20;
    ctx.font = "30px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 40);
    ctx.font = "16px Arial";
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 65);
    ctx.restore();
}

function drawButton(text) {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 30;
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height * 0.75);
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#001022";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars();
    ctx.fillStyle = "#444";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, 20));
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00eaff";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#002233";
    ctx.fillRect(player.x + player.w * 0.55, player.y + 3, player.w * 0.35, 4);
    drawScore();
    drawTitle();
    if (!gameRunning) drawButton(score === 0 ? "Start" : "Replay");
}

function update() {
    platforms.forEach(p => {
        p.x -= scrollSpeed;
        if (p.x + p.width < 0) {
            p.x = canvas.width + 150 + Math.random() * 150;
            p.width = 120 + Math.random() * 150;
        }
    });

    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    let nextY = player.y + player.vy + player.gravity;
    player.onGround = false;

    for (let p of platforms) {
        let playerCenterX = player.x + player.w / 2;
        if (playerCenterX > p.x && playerCenterX < p.x + p.width) {
            if (player.y + player.h <= p.y && nextY + player.h >= p.y) {
                nextY = p.y - player.h;
                player.vy = 0;
                player.onGround = true;
                break;
            }
        }
    }

    if (keys["Space"] && player.onGround) {
        player.vy = -player.jump;
        player.onGround = false;
    }

    if (!player.onGround) player.vy += player.gravity;
    player.y += player.vy;

    if (!player.lastOnGround && player.onGround) {
        score++;
        if (score > highScore) highScore = score;
    }
    player.lastOnGround = player.onGround;

    if (player.y > canvas.height) gameRunning = false;
}

function loop() {
    draw();
    if (gameRunning) update();
    requestAnimationFrame(loop);
}

function startGame() {
    initPlatforms();
    scrollSpeed = baseScrollSpeed;
    gameRunning = true;
}

canvas.addEventListener("click", e => {
    if (!gameRunning) startGame();
});

document.addEventListener("keydown", e => {
    if (!gameRunning && e.code === "Enter") startGame();
});

initPlatforms();
loop();
