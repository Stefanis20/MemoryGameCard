const cardsArray = [
    { name: 'apple', img: 'images/0.jpg' },
    { name: 'banana', img: 'images/1.jpg' },
    { name: 'cherry', img: 'images/2.jpg' },
    { name: 'grape', img: 'images/3.jpg' },
    { name: 'lemon', img: 'images/4.jpg' },
    { name: 'orange', img: 'images/5.jpg' },
    { name: 'peach', img: 'images/6.jpg' },
    { name: 'pear', img: 'images/9.jpg' },
    { name: 'watermelon', img: 'images/7.jpg' },
    { name: 'watermelon1', img: 'images/8.jpg' },
    { name: 'watermelon2', img: 'images/10.jpg' },
    { name: 'watermelon3', img: 'images/11.jpg' },
    { name: 'watermelon4', img: 'images/12.jpg' },
    { name: 'watermelon5', img: 'images/13.jpg' },
    { name: 'watermelon6', img: 'images/14.jpg' },
    { name: 'watermelon7', img: 'images/15.jpg' },
    { name: 'watermelon8', img: 'images/16.jpg' },
    { name: 'watermelon9', img: 'images/17.jpg' },
    { name: 'watermelon10', img: 'images/18.jpg' },
    { name: 'watermelon11', img: 'images/19.jpg' },
    { name: 'watermelon12', img: 'images/20.jpg' },
    { name: 'watermelon13', img: 'images/21.jpg' },
    { name: 'watermelon14', img: 'images/22.jpg' },
    { name: 'watermelon15', img: 'images/23.jpg' },
    { name: 'strawberry', img: 'images/24.jpg' }
];

let gameGrid;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time;
let timerInterval;
let pausedTime = null;
let difficultyLevel = 0;
const difficulties = ['easy', 'medium', 'hard', 'very-hard', 'extreme', 'insane'];
const initialTimes = [30, 40, 50, 60, 70, 80];  // Χρόνος για κάθε επίπεδο
const gameBoard = document.querySelector('.game-board');

function getCardsByDifficulty(difficulty) {
    let selectedCards = [];
    switch (difficulty) {
        case 'easy':
            selectedCards = cardsArray.slice(0, 4); // 4 κάρτες
            break;
        case 'medium':
            selectedCards = cardsArray.slice(0, 8); // 8 κάρτες
            break;
        case 'hard':
            selectedCards = cardsArray.slice(0, 12); // 12 κάρτες
            break;
        case 'very-hard':
            selectedCards = cardsArray.slice(0, 18); // 16 κάρτες
            break;
        case 'extreme':
            selectedCards = cardsArray.slice(0, 21); // 20 κάρτες
            break;
        case 'insane':
            selectedCards = cardsArray.slice(0, 24); // 24 κάρτες
            break;
    }
    return selectedCards.concat(selectedCards).sort(() => 0.5 - Math.random());
}

function startGame() {
    resetStats();
    gameGrid = getCardsByDifficulty(difficulties[difficultyLevel]);
    gameBoard.innerHTML = '';
    createBoard();
    resetTimer(); // Επαναφορά του χρόνου ανάλογα με το επίπεδο
    startTimer();

    if (difficultyLevel >= 2) {
        document.body.classList.add('level-hard');
    } else {
        document.body.classList.remove('level-hard');
    }
}

function createBoard() {
    const columns = difficultyLevel < 2 ? 4 : (difficultyLevel === 2 ? 6 : 6);
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 100px)`;

    gameGrid.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item.name;

        const front = document.createElement('img');
        front.src = item.img;
        front.alt = item.name;

        card.appendChild(front);
        gameBoard.appendChild(card);

        card.addEventListener('click', flipCard);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');
    updateMoves();

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
    if (document.querySelectorAll('.matched').length === gameGrid.length) {
        clearInterval(timerInterval);
        showLevelCompleteMessage();
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetTimer() {
    clearInterval(timerInterval);
    time = initialTimes[difficultyLevel]; // Θέτει τον χρόνο ανάλογα με το επίπεδο
    document.getElementById('time').textContent = time;
}

function startTimer() {
    timerInterval = setInterval(() => {
        time--;
        document.getElementById('time').textContent = time;
        if (time === 0) {
            clearInterval(timerInterval);
            Swal.fire({
                title: 'Time\'s Up!',
                text: 'You ran out of time!',
                icon: 'error',
                confirmButtonText: 'Try Again'
            }).then(() => startGame());
        }
    }, 1000);
}

function resetStats() {
    moves = 0;
    document.getElementById('moves').textContent = moves;
}

function updateMoves() {
    moves++;
    document.getElementById('moves').textContent = moves;
}

function showLevelCompleteMessage() {
    Swal.fire({
        title: 'Level Complete!',
        text: `You finished in ${initialTimes[difficultyLevel] - time} seconds with ${moves} moves!`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Next Level',
        cancelButtonText: 'Try Again'
    }).then((result) => {
        if (result.isConfirmed) {
            difficultyLevel++;
            if (difficultyLevel < difficulties.length) {
                startGame();
            } else {
                Swal.fire({
                    title: 'Congratulations!',
                    text: `You completed all levels!`,
                    icon: 'success',
                    confirmButtonText: 'Restart'
                }).then(() => {
                    difficultyLevel = 0;
                    startGame();
                });
            }
        } else {
            startGame();
        }
    });
}

function pauseGame() {
    clearInterval(timerInterval);
    pausedTime = time;
    Swal.fire({
        title: 'Game Paused',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Restart',
        showDenyButton: true,
        denyButtonText: 'Exit'
    }).then((result) => {
        if (result.isConfirmed) {
            time = pausedTime;
            startTimer();
        } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
            startGame();
        } else if (result.isDenied) {
            window.close();
        }
    });
}

document.getElementById('pause-button').addEventListener('click', pauseGame);

document.getElementById('restart-button').addEventListener('click', () => {
    difficultyLevel = 0;
    startGame();
});

document.getElementById('difficulty-level').addEventListener('change', (event) => {
    difficultyLevel = difficulties.indexOf(event.target.value);
    startGame();
});

startGame();


