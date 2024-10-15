// Variabel global
let playerPosition = 1;
let snakes = JSON.parse(document.getElementById('snakes-data').textContent);
let ladders = JSON.parse(document.getElementById('ladders-data').textContent);
const boardCanvas = document.getElementById('board');
const ctx = boardCanvas.getContext('2d');
const diceImage = document.getElementById('dice');
const playerPositionText = document.getElementById('player-position');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const rollDiceButton = document.getElementById('roll-dice');
const regenerateButton = document.getElementById('regenerate-board');
let playerName = '';
let player1Character = '';
let player2Character = '';

const boardSize = 10;
let tileSize;

let players = [
    { name: '', position: 1, character: '' },
    { name: '', position: 1, character: '' }
];
let currentPlayer = 0;

// Fungsi untuk menggambar papan permainan
function drawBoard() {
    ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
    
    const colors = ['#FFC0CB', '#FFFFE0', '#E6E6FA', '#98FB98', '#FFA07A'];
    let colorIndex = 0;
    
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            let tileNumber;
            if (row % 2 === 0) {
                tileNumber = boardSize * (boardSize - row) - col;
            } else {
                tileNumber = boardSize * (boardSize - 1 - row) + col + 1;
            }
            
            const x = col * tileSize;
            const y = row * tileSize;
            
            ctx.fillStyle = colors[colorIndex % colors.length];
            ctx.fillRect(x, y, tileSize, tileSize);
            
            ctx.fillStyle = "#000000";
            ctx.font = `${tileSize / 3}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(tileNumber, x + tileSize / 2, y + tileSize / 2);
            
            colorIndex++;
        }
    }
    
    drawSnakesAndLadders();
    players.forEach((player, index) => drawPlayer(player.position, player.character, index));
}

// Fungsi untuk menggambar ular atau tangga
function drawSnakeOrLadder(start, end, symbol) {
    const startPos = getPositionFromNumber(start);
    const endPos = getPositionFromNumber(end);
    
    ctx.beginPath();
    ctx.moveTo(startPos.x + tileSize / 2, startPos.y + tileSize / 2);
    ctx.lineTo(endPos.x + tileSize / 2, endPos.y + tileSize / 2);
    ctx.stroke();
    
    ctx.font = `${tileSize / 2}px Arial`;
    ctx.fillText(symbol, startPos.x + tileSize / 2, startPos.y + tileSize / 2);
}

// Fungsi untuk mendapatkan posisi X dan Y dari nomor kotak
function getPositionFromNumber(number) {
    const row = Math.floor((number - 1) / boardSize);
    const col = (number - 1) % boardSize;
    return {
        x: col * tileSize,
        y: (boardSize - 1 - row) * tileSize
    };
}

// Fungsi untuk menggambar pemain
function drawPlayer(position, character, playerIndex) {
    const pos = getPositionFromNumber(position);
    if (character) {
        const img = new Image();
        img.src = `/static/img/char/${character}.png`;
        img.onload = () => {
            const offsetX = playerIndex * (tileSize / 2);
            ctx.drawImage(img, pos.x + offsetX, pos.y, tileSize / 2, tileSize / 2);
        };
    } else {
        ctx.fillStyle = playerIndex === 0 ? 'red' : 'blue';
        ctx.beginPath();
        ctx.arc(pos.x + tileSize / 2, pos.y + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Fungsi untuk animasi rolling dadu
function rollDiceAnimation(callback) {
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        diceImage.src = `/static/img/dice/dice${diceRoll}.png`;
        diceImage.onload = () => {
            rollCount++;
            if (rollCount > 10) {
                clearInterval(rollInterval);
                callback(diceRoll);
            }
        };
    }, 100);
}

// Fungsi untuk melempar dadu
function rollDice() {
    if (players[0].character === '' || players[1].character === '') {
        alert("Silakan pilih karakter untuk kedua pemain terlebih dahulu!");
        return;
    }
    rollDiceButton.disabled = true;
    rollDiceAnimation((diceRoll) => {
        players[currentPlayer].position += diceRoll;
        if (players[currentPlayer].position > 100) {
            players[currentPlayer].position = 100;
        }
        
        // Cek ular dan tangga
        if (snakes[players[currentPlayer].position]) {
            players[currentPlayer].position = snakes[players[currentPlayer].position];
        } else if (ladders[players[currentPlayer].position]) {
            players[currentPlayer].position = ladders[players[currentPlayer].position];
        }
        
        updatePlayerPositionText();
        drawBoard();
        
        if (players[currentPlayer].position === 100) {
            alert(`Selamat ${players[currentPlayer].name}! Anda menang!`);
            resetGame();
        } else {
            currentPlayer = (currentPlayer + 1) % 2;
            rollDiceButton.disabled = false;
        }
    });
}

// Event listener untuk tombol lempar dadu
rollDiceButton.addEventListener('click', rollDice);

// Event listener untuk tombol regenerate
regenerateButton.addEventListener('click', () => {
    fetch('/regenerate')
        .then(response => response.json())
        .then(data => {
            snakes = data.snakes;
            ladders = data.ladders;
            resetGame();
        });
});

// Event listener untuk tombol mulai permainan
startGameButton.addEventListener('click', () => {
    const player1Name = document.getElementById('player1-name').value.trim();
    const player2Name = document.getElementById('player2-name').value.trim();
    if (player1Name && player2Name) {
        players[0].name = player1Name;
        players[1].name = player2Name;
        document.getElementById('player1-name').disabled = true;
        document.getElementById('player2-name').disabled = true;
        startGameButton.disabled = true;
        rollDiceButton.disabled = false;
        updatePlayerPositionText();
        drawBoard();
    } else {
        alert("Silakan masukkan nama kedua pemain terlebih dahulu!");
    }
});

// Fungsi untuk mereset permainan
function resetGame() {
    players.forEach(player => {
        player.position = 1;
        player.name = '';
        player.character = '';
    });
    currentPlayer = 0;
    document.getElementById('player1-name').disabled = false;
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').disabled = false;
    document.getElementById('player2-name').value = '';
    document.querySelectorAll('#player1-characters img, #player2-characters img').forEach(img => {
        img.classList.remove('selected');
    });
    startGameButton.disabled = false;
    rollDiceButton.disabled = true;
    updatePlayerPositionText();
    drawBoard();
}

// Fungsi inisialisasi permainan
function initGame() {
    const containerWidth = document.getElementById('game-container').offsetWidth;
    const containerHeight = document.getElementById('game-container').offsetHeight;
    const size = Math.min(containerWidth * 0.6, containerHeight * 0.7);
    boardCanvas.width = size;
    boardCanvas.height = size;
    tileSize = size / boardSize;
    drawBoard();
    rollDiceButton.disabled = true;
}

// Panggil fungsi inisialisasi saat website dibuka
window.addEventListener('load', () => {
    diceImage.src = '/static/img/dice/dice1.png';
    initGame();
});

window.addEventListener('resize', () => {
    boardCanvas.width = boardCanvas.offsetWidth;
    boardCanvas.height = boardCanvas.offsetWidth;
    tileSize = boardCanvas.width / boardSize;
    initGame();
});

function drawSnakesAndLadders() {
    ctx.lineWidth = 2;
    for (let start in snakes) {
        ctx.strokeStyle = "red";
        drawSnakeOrLadder(parseInt(start), snakes[start], "🐍");
    }
    for (let start in ladders) {
        ctx.strokeStyle = "green";
        drawSnakeOrLadder(parseInt(start), ladders[start], "🪜");
    }
}

document.querySelectorAll('#player1-characters img, #player2-characters img').forEach(img => {
    img.addEventListener('click', (e) => {
        const playerIndex = e.target.parentElement.id === 'player1-characters' ? 0 : 1;
        const character = e.target.dataset.char;
        players[playerIndex].character = character;
        e.target.parentElement.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
        e.target.classList.add('selected');
        drawBoard();
    });
});

function updatePlayerPositionText() {
    document.getElementById('player1-position').textContent = `Posisi ${players[0].name}: ${players[0].position}`;
    document.getElementById('player2-position').textContent = `Posisi ${players[1].name}: ${players[1].position}`;
}