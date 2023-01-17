const puzzle = document.getElementById("puzzle");
let size = 3;
let puzzlePieces = [];
let startTime = Date.now();

//getRow returns row by given position
function getRow(position) {
    return Math.ceil(position / size);
}

//getCol return column by given position
function getCol(position) {
    let col = position % size;
    return col === 0 ? size : col;
}

//generatePuzzle generates the puzzle pieces and stores them in array. Each piece is 200px
function generatePuzzle() {
    for(let i = 0; i < size * size; i ++) {
        let piece = {
            position: i + 1,
            value: i + 1,
            x: (getCol(i + 1) - 1) * 200,
            y: (getRow(i + 1) - 1) * 200,
            hidden: false,
        }
        puzzlePieces.push(piece)
    }
}

//renderPuzzle renders the puzzle on the screen and adds event listeners on click to each piece
function renderPuzzle() {
    puzzle.innerHTML="";
    puzzlePieces.forEach(piece => {
        if(!piece.hidden) {
            let puzzlePieceElement = document.getElementById(`puzzle-piece-${piece.position}`);
            if (!puzzlePieceElement) {
                puzzlePieceElement = document.createElement('div');
                puzzlePieceElement.setAttribute('id', `puzzle-piece-${piece.position}`);
                puzzlePieceElement.setAttribute('class', 'puzzle-piece');
                puzzle.appendChild(puzzlePieceElement);
                puzzlePieceElement.addEventListener('click', () => {
                    move(puzzlePieceElement)
                });
            }
            puzzlePieceElement.innerHTML = piece.value;
            puzzlePieceElement.style.left = `${piece.x}px`;
            puzzlePieceElement.style.top = `${piece.y}px`;
        }
    });
}

//getRandomValues return array with random values which number is size * size
function getRandomValues() {
    let values = [];
    for(let i = 0; i < size * size; i++){
        values.push(i + 1);
    }

    let shuffledValues = values.sort(() => Math.random() - 0.5);
    return shuffledValues;
}

//hideLastPiece hides the number 9 as a last piece 
function hideLastPiece() {
    let lastPiece = puzzlePieces.find((piece) => piece.value === size * size);
    lastPiece.hidden = true;
}

//shufflePuzzlePieces shuffles the puzzle pieces
function shufflePuzzlePieces() {
    let randomValues = getRandomValues();
    let i = 0;
    puzzlePieces.forEach(piece => {
        piece.value = randomValues[i++];
    });
    hideLastPiece();
}

//getEmptyPuzzlePiece returns the empty piece
function getEmptyPuzzlePiece() {
    return puzzlePieces.find((piece) => piece.hidden === true);
}

//getPuzzlPieceeByPos returns a puzzle piece by given position
function getPuzzlPieceeByPos(pos) {
    return puzzlePieces.find((piece) => piece.position === pos)
}

//findPosByCoordinates finds piece position by coordinates X and Y
function findPosByCoordinates(X, Y) {
    for(let piece of puzzlePieces) {
        if (piece.x === X && piece.y === Y){
            return piece.position;
        }
    }
}

//swapPositions swaps 2 pieces (the clicked piece and the empty one if its by the rules of the game)
function swapPositions(emptyPiece, clickedPiece, isX) {
    const clickedPieceX = Number(clickedPiece.style.left.slice(0, -2));
    const clickedPieceY = Number(clickedPiece.style.top.slice(0, -2));
    let pos = findPosByCoordinates(clickedPieceX, clickedPieceY);
    let piece = getPuzzlPieceeByPos(pos);

    // position swapping
    let temp = emptyPiece.position
    emptyPiece.position = piece.position
    piece.position = temp

    // x position swapping
    if (isX) {
        temp = emptyPiece.x
        emptyPiece.x = piece.x
        piece.x = temp
    } else {
        // must be y
        temp = emptyPiece.y
        emptyPiece.y = piece.y
        piece.y = temp
    }
}

//solved checks if the puzzle is solved
function solved() {
    for(let i = 0; i < size * size; i ++) {
        if(puzzlePieces[i].position !== puzzlePieces[i].value) {
            return false;
        }
    }
    return true;
}

//saveUserScore saves user socre (time)
function saveUserScore(user, score, users) {
    user.score = score;
    console.log("saveUserScore", users);
    localStorage.setItem("users", JSON.stringify(users))
}

//isBetterScore checks if the user current score is better than the last one
function isBetterScore(user, score) {
    if(!user.score){
        return true;
    }
    let currScore = user.score.split(' '); // currScore = "X minutes and Y seconds"
    let currMinutes = currScore[0];
    let currSeconds = currScore[3];
    let newScore = score.split(' ');
    let newMinutes = newScore[0];
    let newSeconds = newScore[3];

    if(newMinutes < currMinutes) {
        return true;
    } else if (newMinutes === currMinutes){
        if(newSeconds < currSeconds){
           return true;
        } else {
            return false
        }
    }

    return false;
}

//saveScoreForCurrentPlayer saves the given score for the current player
function saveScoreForCurrentPlayer(score) {
    let usersArr = JSON.parse(localStorage.getItem("users"));
    console.log("saveScoreForCurrentPlayer", usersArr);
    for(let i = 0; i < usersArr.length; i++) {
        if(usersArr[i].currentPlayer === true) {
            if(isBetterScore(usersArr[i], score)) {
                saveUserScore(usersArr[i], score, usersArr);
            }  
        }
    }
}

//getNeededData filters the data which will be displayed to the user (password)
function getNeededData() {
    let neededData = [];
    let usersArr = JSON.parse(localStorage.getItem("users"));
    for(let i = 0; i < usersArr.length; i++) {
        let neededUserInfo = {
            user: usersArr[i].email,
            score: usersArr[i].score,
            currentPlayer: usersArr[i].currentPlayer
        };
        console.log("neededInfo", neededUserInfo);
        neededData.push(neededUserInfo);
    }
    console.log("getNeededData NeededData ", neededData);
    return neededData;
}

//saveData saves the data to the local storage
function saveData() {
    let ranking = getNeededData();
    console.log("saveData ranking ", ranking);
    localStorage.setItem("ranking", JSON.stringify(ranking));
}

let rankingBtn = document.getElementById("ranking-button");

//move moves the clicked piece if possible and checks if the puzzle is solved
function move(piece) {
    const emptyPuzzlePiece = getEmptyPuzzlePiece();
    // Get the position of the empty puzzle piece and the clicked puzzle piece
    const emptyX = emptyPuzzlePiece.x;
    const emptyY = emptyPuzzlePiece.y;

    const clickedPieceX = Number(piece.style.left.slice(0, -2));
    const clickedPieceY = Number(piece.style.top.slice(0, -2));

    // If the clicked puzzle piece is adjacent to the empty puzzle piece, we will swap their positions
    if (clickedPieceX === emptyX && (clickedPieceY === emptyY - 200 || clickedPieceY === emptyY + 200)) {
        swapPositions(emptyPuzzlePiece, piece, false);
        renderPuzzle();
    }
    if (clickedPieceY === emptyY && (clickedPieceX === emptyX - 200 || clickedPieceX === emptyX + 200)) {
        swapPositions(emptyPuzzlePiece, piece, true);
        renderPuzzle();
    }  

    if(solved()) {
        rankingBtn.disabled = false;
        let minutes = Math.floor((Date.now() - startTime)/ 1000/ 60)
        let seconds = Math.floor((Date.now() - startTime)/ 1000 % 60);
        let score = `${minutes} minutes and ${seconds} seconds`;
        setTimeout(function() {
            alert(`Puzzle solved! For ${score}`);
            window.open(
                "/views/ranking.html",
                '_blank' // <- This is what makes it open in a new window.
              );
        }, 500);
        saveScoreForCurrentPlayer(score);
        saveData(); 
    }
}

let gameStarted = false;
//event listener for clicking the start button - renders the puzzle. Clickable only first time
document.getElementById("start-button").addEventListener("click", function() {
    gameStarted = true;
    startTime = Date.now();
    this.disabled = true;
    generatePuzzle();
    shufflePuzzlePieces();
    renderPuzzle();
});

//event listener for clicking the restart button - rerenders the puzzle. Clickable only after start game button
document.getElementById("restart-button").addEventListener("click", function() {
    if(gameStarted) {
        startTime = Date.now();
        puzzlePieces = [];
        generatePuzzle()
        shufflePuzzlePieces();
        renderPuzzle();
    }
});

rankingBtn.disabled = true;
//event listener for clicking the ranking button - shows the ranking. Clickable only after first solved puzzle
rankingBtn.addEventListener("click", function() {
    window.open(
        "/views/ranking.html",
        '_blank' // <- This is what makes it open in a new window.
      );
});