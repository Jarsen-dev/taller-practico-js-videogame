const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: Math.round(undefined),
    y: Math.round(undefined)
};

const giftPosition = {
    x: Math.round(undefined),
    y: Math.round(undefined)
};

let enemyPosition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize)

    elementsSize = Math.round(canvasSize / 10);

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    //.trim() elimina los espacios en blanco al inicio y al final del string
    //.split('\n') nos separa el string por saltos de línea
    //.split(' ') nos separa el string por espacios, es decir en palabras completas
    //.split('') nos separa el string por cada elemento dentro del array
    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log(mapRows, mapRowCols);

    showLives();

    enemyPosition = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if(col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if(col == 'X') {
                enemyPosition.push({
                    x: Math.round(posX),
                    y: Math.round(posY),
                });
            }
            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer() {
    const giftCollisionX = giftPosition.x == playerPosition.x;
    const giftCollisionY = giftPosition.y == playerPosition.y;
    const giftCollision = giftCollisionX && giftCollisionY;

    if(giftCollision) {
        levelWin();
    }

    const enemyCollision = enemyPosition.find(enemy => {
        const enemyCollisionX = enemy.x == playerPosition.x;
        const enemyCollisionY = enemy.y == playerPosition.y;
        return enemyCollisionX && enemyCollisionY;
    });

    if(enemyCollision) {
        console.log('Chocaste contra un enemigo :P');
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    console.log(playerPosition);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame();
}

function levelFail() {
    lives--;

    if(lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;   
    startGame();
}

function gameWin() {
    console.log('¡Terminaste el juego!')
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'SUPERASTE EL RECORD :)';
        } else {
            pResult.innerHTML = 'Lo siento, no superaste el record :/';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primera vez? Ahora trata de superar tu record :)'
    }
    console.log({recordTime, playerTime});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);

    spanLives.innerHTML = heartsArray.join('');
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if(event.key == 'ArrowUp') moveUp();
    if(event.key == 'ArrowLeft') moveLeft();
    if(event.key == 'ArrowRight') moveRight();
    if(event.key == 'ArrowDown') moveDown();
}

function moveUp() {
    console.log('Me quiero mover hacia arriba');
    if((playerPosition.y - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}
function moveLeft() {
    console.log('Me quiero mover hacia la izquierda');
    if((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function moveRight() {
    console.log('Me quiero mover hacia la derecha');
    if((playerPosition.x + elementsSize) > Math.round(canvasSize)) {
        console.log('OUT');
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}
function moveDown() {
    console.log('Me quiero mover hacia abajo');
    if((playerPosition.y + elementsSize) > Math.round(canvasSize)) {
        console.log('OUT');
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}