const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

const hp1Text = document.getElementById("hp1");
const hp2Text = document.getElementById("hp2");

const health1 = document.getElementById("health1");
const health2 = document.getElementById("health2");

const timerText = document.getElementById("timer");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

const arena = document.getElementById("arena");

let gameRunning = true;

let hp1 = 100;
let hp2 = 100;

let timeLeft = 60;

const speed = 5;
const attackDamage = 10;
const attackDistance = 90;

let p1 = {
    x: 80,
    y: 200
};

let p2 = {
    x: 800,
    y: 200
};

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    // Mencegah tombol panah menggeser halaman
    if ([
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
    ].includes(event.key)) {
        event.preventDefault();
    }

    // Player 1 menyerang
    if (event.key.toLowerCase() === "f") {
        attack(1);
    }

    // Player 2 menyerang
    if (event.key.toLowerCase() === "l") {
        attack(2);
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

function movePlayers() {

    if (!gameRunning) return;

    // PLAYER 1

    if (keys["w"]) {
        p1.y -= speed;
    }

    if (keys["s"]) {
        p1.y += speed;
    }

    if (keys["a"]) {
        p1.x -= speed;
    }

    if (keys["d"]) {
        p1.x += speed;
    }

    // PLAYER 2

    if (keys["arrowup"]) {
        p2.y -= speed;
    }

    if (keys["arrowdown"]) {
        p2.y += speed;
    }

    if (keys["arrowleft"]) {
        p2.x -= speed;
    }

    if (keys["arrowright"]) {
        p2.x += speed;
    }

    keepInsideArena(p1);
    keepInsideArena(p2);

    updatePosition();

    requestAnimationFrame(movePlayers);
}

function keepInsideArena(player) {

    const maxX = arena.clientWidth - 65;
    const maxY = arena.clientHeight - 65;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.y < 0) {
        player.y = 0;
    }

    if (player.x > maxX) {
        player.x = maxX;
    }

    if (player.y > maxY) {
        player.y = maxY;
    }
}

function updatePosition() {

    player1.style.left = p1.x + "px";
    player1.style.top = p1.y + "px";

    player2.style.left = p2.x + "px";
    player2.style.top = p2.y + "px";
}

function getDistance() {

    const center1X = p1.x + 32;
    const center1Y = p1.y + 32;

    const center2X = p2.x + 32;
    const center2Y = p2.y + 32;

    const dx = center1X - center2X;
    const dy = center1Y - center2Y;

    return Math.sqrt(dx * dx + dy * dy);
}

function attack(playerNumber) {

    if (!gameRunning) return;

    const distance = getDistance();

    if (distance > attackDistance) {
        message.textContent = "⚠️ Terlalu jauh!";
        setTimeout(() => {
            if (gameRunning) {
                message.textContent = "";
            }
        }, 500);
        return;
    }

    if (playerNumber === 1) {

        hp2 -= attackDamage;

        player1.classList.add("attack");
        player2.classList.add("hit");

        setTimeout(() => {
            player1.classList.remove("attack");
            player2.classList.remove("hit");
        }, 200);

    } else {

        hp1 -= attackDamage;

        player2.classList.add("attack");
        player1.classList.add("hit");

        setTimeout(() => {
            player2.classList.remove("attack");
            player1.classList.remove("hit");
        }, 200);
    }

    updateHealth();
    checkWinner();
}

function updateHealth() {

    if (hp1 < 0) hp1 = 0;
    if (hp2 < 0) hp2 = 0;

    hp1Text.textContent = hp1;
    hp2Text.textContent = hp2;

    health1.style.width = hp1 + "%";
    health2.style.width = hp2 + "%";
}

function checkWinner() {

    if (hp1 <= 0) {

        gameRunning = false;

        message.textContent = "🏆 PLAYER 2 MENANG!";
        restartButton.style.display = "inline-block";

    } else if (hp2 <= 0) {

        gameRunning = false;

        message.textContent = "🏆 PLAYER 1 MENANG!";
        restartButton.style.display = "inline-block";
    }
}

function startTimer() {

    const timer = setInterval(() => {

        if (!gameRunning) {
            clearInterval(timer);
            return;
        }

        timeLeft--;

        timerText.textContent = timeLeft;

        if (timeLeft <= 0) {

            gameRunning = false;

            if (hp1 > hp2) {
                message.textContent = "🏆 PLAYER 1 MENANG!";
            } else if (hp2 > hp1) {
                message.textContent = "🏆 PLAYER 2 MENANG!";
            } else {
                message.textContent = "🤝 HASILNYA SERI!";
            }

            restartButton.style.display = "inline-block";
            clearInterval(timer);
        }

    }, 1000);
}

restartButton.addEventListener("click", function() {

    hp1 = 100;
    hp2 = 100;

    timeLeft = 60;

    p1.x = 80;
    p1.y = 200;

    p2.x = 800;
    p2.y = 200;

    gameRunning = true;

    message.textContent = "";

    restartButton.style.display = "none";

    timerText.textContent = timeLeft;

    updateHealth();
    updatePosition();

    startTimer();
});

updateHealth();
updatePosition();

movePlayers();
startTimer();