
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = 'X'; // User starts as 'X'

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', handleReset);

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        gameActive = false;
        message.textContent = `${currentPlayer} wins!`;
        return;
    }

    if (!gameState.includes("")) {
        gameActive = false;
        message.textContent = `It's a draw!`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500); // Adding a delay for realism
    }
}

function makeComputerMove() {
    if (!gameActive) return;

    // Try to win
    let move = findBestMove('O');
    if (move === null) {
        // Block the player
        move = findBestMove('X');
    }
    if (move === null) {
        // Pick a random move
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === "") {
                availableCells.push(index);
            }
        });
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    gameState[move] = currentPlayer;
    const computerCell = document.querySelector(`.cell[data-index='${move}']`);
    computerCell.textContent = currentPlayer;
    computerCell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        gameActive = false;
        message.textContent = `${currentPlayer} wins!`;
        return;
    }

    if (!gameState.includes("")) {
        gameActive = false;
        message.textContent = `It's a draw!`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === player && gameState[b] === player && gameState[c] === "") {
            return c;
        }
        if (gameState[a] === player && gameState[c] === player && gameState[b] === "") {
            return b;
        }
        if (gameState[b] === player && gameState[c] === player && gameState[a] === "") {
            return a;
        }
    }
    return null;
}

function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
}

function handleReset() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
    message.textContent = "";
}
