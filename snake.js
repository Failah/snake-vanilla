console.log('JS OK');

const gameBoard = /** @type {HTMLCanvasElement} */ (document.querySelector("#game-board"));

const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score-text");
const resetButton = document.querySelector("#reset-button");

// GAME
let seconds = 0;
const timerElement = document.getElementById('timer');

// BOARD
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBG = "white";

// SNAKE AND FOOD
const snakeColor = "green";
const snakeBorder = "black";
const foodColor = "red";

const tilesize = 25;

let activateGame = false;
let running = false;
let snakeSpeed = 75;
let xVelocity = 0;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

let snake = [
    { x: tilesize * 2, y: 0 },
    { x: tilesize, y: 0 },
    { x: 0, y: 0 }
];

let canResetGame = false;

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};

function nextTick() {
    if (running) {
        setTimeout(() => {
            if (activateGame) {
                drawTime();
                clearBoard();
                drawFood();
                moveSnake();
                checkGameOver();
            }
            drawSnake();
            nextTick();
        }, snakeSpeed);
    } else {
        if (activateGame) {
            displayGameOver();
        }
    }

};

function drawTime() {
    // Incrementa il timer di un secondo
    seconds++;

    // Calcola ore, minuti e secondi a partire dai secondi totali
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);
    const secs = seconds % 60;

    // Formatta il tempo come hh:mm:ss
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Mostra il tempo nel DOM
    timerElement.innerText = time;

}

function clearBoard() {
    ctx.fillStyle = boardBG;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / tilesize) * tilesize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - tilesize);
    foodY = randomFood(0, gameWidth - tilesize);
};

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, tilesize, tilesize);
};

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    if (snake[0].x == foodX && snake[0].y == foodY) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
};

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, tilesize, tilesize);
        ctx.strokeRect(snakePart.x, snakePart.y, tilesize, tilesize);
    })
};

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -tilesize);
    const goingDown = (yVelocity == tilesize);
    const goingRight = (xVelocity == tilesize);
    const goingLeft = (xVelocity == -tilesize);

    const R = 82;

    switch (true) {
        case (keyPressed == LEFT && !goingRight):
            if (!activateGame) {
                activateGame = true;
            }
            xVelocity = -tilesize;
            yVelocity = 0;
            break;
        case (keyPressed == UP && !goingDown):
            if (!activateGame) {
                activateGame = true;
            }
            xVelocity = 0;
            yVelocity = -tilesize;
            break;
        case (keyPressed == RIGHT && !goingLeft):
            if (!activateGame) {
                activateGame = true;
            }
            xVelocity = tilesize;
            yVelocity = 0;
            break;
        case (keyPressed == DOWN && !goingUp):
            if (!activateGame) {
                activateGame = true;
            }
            xVelocity = 0;
            yVelocity = tilesize;
            break;
        case (keyPressed == R):
            if (canResetGame) {
                canResetGame = false;
                resetGame();
            }
            break;
    }
};

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
};

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    running = false;
    canResetGame = true;
    resetButton.removeAttribute("disabled");
};

function resetGame() {
    resetButton.setAttribute("disabled", true);
    score = 0;

    xVelocity = 0;
    yVelocity = 0;

    snake = [
        { x: tilesize * 2, y: 0 },
        { x: tilesize, y: 0 },
        { x: 0, y: 0 }
    ];

    activateGame = false;
    seconds = 0;
    resetTimer = "00:00:00";
    timerElement.innerText = resetTimer;
    clearBoard();
    gameStart();
};

