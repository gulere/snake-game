//ece's snake game
//game tinkering #2

//HTML elements
const gameboard = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const pauseText = document.getElementById("pause-text");

//Game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let isPaused = false;

//Sound effects
const spacebarPressSound = document.getElementById("spacebarPress");
const wallCollisionSound = document.getElementById("wallCollision");
const foodChompSound = document.getElementById("foodChomp");

//Draw gameboard, snake and food
function draw() {
    gameboard.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement("div", "snake");
        setPosition(snakeElement, segment);
        gameboard.appendChild(snakeElement);
    });
}

//Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Draw food function
function drawFood() {
    if(gameStarted) {
        const foodElement = createGameElement("div", "food");
        setPosition(foodElement, food);
        gameboard.appendChild(foodElement);
    }
}

//Generate food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

//Moving the snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
    case "up":
        head.y--;
        break;
    case "down":
        head.y++;
        break;
    case "left":
        head.x--;
        break;
    case "right":
        head.x++;
        break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        foodChompSound.play(); //Sound effect
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); 
        gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

//Start game function
function startGame() {
    gameStarted = true; 
    instructionText.style.display = "none";
    logo.style.display = "none";
    spacebarPressSound.play(); // Sound effect
    gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
    }, gameSpeedDelay);
    pauseText.style.display = "none";
}

//Keypress event listener
function handleKeyPress(event) {
    if (isPaused && event.code === "Space") {
        resumeGame();
        } else if (!gameStarted && (event.code === "Space" || event.key === ' ')) {
        startGame();
        } else if (gameStarted && !isPaused && event.code === "Space") {
        // Call the pause functionality
        pauseGame();
    } else {
        switch (event.key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
        }
    }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
      gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
      gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
      gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
      gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        wallCollisionSound.play();
        resetGame();
    }

    for(let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            wallCollisionSound.play();
            resetGame();
        }
    }
}


//Functions pause, resume and reset
function pauseGame() {
    isPaused = true;
    clearInterval(gameInterval); // Clear the game loop interval
    pauseText.style.display = "block";
}

function resumeGame() {
    isPaused = false;
    clearInterval(gameInterval); // Clear the paused interval
    pauseText.style.display = "none";
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay); // Restart the game loop
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y:10}];
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
}

function updateHighScore() {
    const currentScore = snake.length -1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, "0");
    }
    highScoreText.style.display = "block";
}

