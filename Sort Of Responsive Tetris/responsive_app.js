const layout = document.querySelector('.layout')
const game = document.querySelector('.game')
const grid = document.querySelector('.grid')
const nextBlockBoxGrid = document.querySelector('.next-block-box')
const resultDisplay = document.querySelector('.result')
const levelDisplay = document.querySelector('.level')
var blockId
var nextBlockName
var blockName
var nextBlockRow
var blockRows
var previousBlockRows
var rowOne; var rowTwo
const width = 10
var atEdge = false
const atLeftEdge = (leftEdge) => leftEdge % width === 0
const atRightEdge = (rightEdge) => (rightEdge - 9) % width === 0 
var disableArrowLeft = false
var disableArrowRight = false
const totalSquares = 200
const rows = []
var newBlock = false
var intervalLength = 1000
var savedIntervalLength = intervalLength
var blockOrientation
var reversedOrder = false
var finishedAnimation = true
var level = 1
var totalScore = 0
const singleLineScore = 100; const doubleLineScore = 300; const tripleLineScore = 500; const quadrupleLineScore = 800
var totalLinesCleared = 0
var gamePaused = false
const gameMenuPopup = document.querySelector('.game-menu-popup')
const gameDisplay = document.querySelector('.game-display')
const button = document.querySelector('#button')
var newGame = true

//create 10x20 grid of squares for game box
for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

//create 5x10 grid of squares for next block box
for (let i = 0; i < 50; i++) {
    const nextBlockBoxSquare = document.createElement('div')
    nextBlockBoxGrid.appendChild(nextBlockBoxSquare)
}

const nextBlockBoxSquares = Array.from(document.querySelectorAll('.next-block-box div'))

//create 2d array to represent rows
for (let i = 0; i < totalSquares; i += width) {
    rows.push(squares.slice(i, i + width))
}

//add class 'bottom-row' to bottom row of grid
for ( let i = 0; i < width; i++) {
    rows[19][i].classList.add('bottom-row')
}

//shapes of each block type
blockSpecs = [
    iBlockSpecs = [[0,3],[0,4],[0,5],[0,6]],
    jBlockSpecs = [[0,3],[1,3],[1,4],[1,5]],
    lBlockSpecs = [[0,5],[1,3],[1,4],[1,5]],
    oBlockSpecs = [[0,4],[0,5],[1,4],[1,5]],
    sBlockSpecs = [[0,4],[0,5],[1,3],[1,4]],
    tBlockSpecs = [[0,4],[1,3],[1,4],[1,5]],
    zBlockSpecs = [[0,3],[0,4],[1,4],[1,5]],
]

//block constructor
class Block {
    constructor(blockLabel, specs) {
        this.blockLabel = blockLabel
        this.squareOne = [specs[0]]
        this.squareTwo = [specs[1]]
        this.squareThree = [specs[2]]
        this.squareFour = [specs[3]]
    }
}

//blocks array
const blocks = [
    new Block('iblock', iBlockSpecs),
    new Block('jblock', jBlockSpecs),
    new Block('lblock', lBlockSpecs),
    new Block('oblock', oBlockSpecs),
    new Block('sblock', sBlockSpecs),
    new Block('tblock', tBlockSpecs),
    new Block('zblock', zBlockSpecs),
]

//increase speed of block drop
function decreaseInterval() {
    if (intervalLength > 0) {
        if (totalLinesCleared - (level*10) >= 0) {
            console.log('Total Lines Cleared:', totalLinesCleared)
            intervalLength -= (intervalLength / 10)
            console.log('Interval Length:', intervalLength)
            level += 1
            levelDisplay.innerHTML = level
            console.log('Level', level)
        }
    }
}

//choose next block to appear
function chooseBlock() {
    nextBlockRows = [rowOne = [], rowTwo = [],]
    blockOrientation = 'horizontal'
    const randomNumber = Math.floor(Math.random() * 7)
    const nextBlock = Object.entries(blocks[randomNumber])
    for (const [key, value] of Object.entries(nextBlock)) {
        if (typeof value[1] == "string") {
            nextBlockName = value[1]
        } else if (value[1][0][0] == 0) {
            rowOne.push(value[1][0][1])
        } else {
            rowTwo.push(value[1][0][1] + 10)
        }
    }
    decreaseInterval()
}

//apply class changes to each square comprising block
function blockRowsLooper(methodOne, argOne, methodTwo, argTwo) {
    blockRows.forEach(blockRow => {
        blockRow.forEach(element => {
            if (methodOne == 'add'){
                squares[element].classList.add(argOne)
            } else if (methodOne == 'remove'){
                squares[element].classList.remove(argOne)
            } else {
                //do nothing
            }
            if (methodTwo == 'add'){
                squares[element].classList.add(argTwo)
            } else if (methodTwo == 'remove'){
                squares[element].classList.remove(argTwo)
            } else {
                //do nothing
            }
        });
    });
}

//show next block in next block box
function displayNextBlock() {
    previousBlockRows = []; previousBlockName = nextBlockName
    nextBlockRows.forEach(nextBlockRow => {
        previousBlockRows.push([...nextBlockRow])
        nextBlockRow.forEach(element => {
            nextBlockBoxSquares[element + 20].classList.add(nextBlockName)
        })
    })
}

//remove previous block from next block box
function hidePreviousBlock() {
    blockRows = []; blockName = nextBlockName
    previousBlockRows.forEach(previousBlockRow => {
        blockRows.push([...previousBlockRow])
        previousBlockRow.forEach(element => {
            nextBlockBoxSquares[element + 20].classList.remove(blockName)
        })
    })
}

//draw block after movement
function drawBlockToo() {
    blockRowsLooper('add', blockName, 'add', 'current-block')
}

//remove block before movement
function removeBlockTooTwo() {
    blockRowsLooper('remove', blockName, 'remove', 'current-block')
}

//turn on block movement and player controls
function goGame() {
    blockId = setInterval(dropBlockInterval, intervalLength)
    document.addEventListener('keydown', dropBlockKey)
    document.addEventListener('keydown', instantDropBlock)
    document.addEventListener('keydown', lateralMoveBlock)
    document.addEventListener('keydown', rotateBlockTwo)
}

//turn off block movement and player controls
function stopGame() {
    clearInterval(blockId)
    document.removeEventListener('keydown', dropBlockKey)
    document.removeEventListener('keydown', instantDropBlock)
    document.removeEventListener('keydown', lateralMoveBlock)
    document.removeEventListener('keydown', rotateBlockTwo)
}

//stop game running and diplsay game paused box or start game and hide game paused box when spacebar pressed
function pauseGame(e) {
    switch (e.key) {
        case 'p':
            if (gamePaused == false) {
                stopGame()
                gameDisplay.innerHTML = 'GAME PAUSED'
                gameDisplay.style.marginTop = '5%'
                gameMenuPopup.style.display = 'block'
                button.style.display = 'none'
                gamePaused = true
            } else if (gamePaused == true) {
                gameDisplay.style.marginTop = '0%'
                gameMenuPopup.style.display = 'none'
                button.style.display = 'block'
                goGame()
                gamePaused = false
            }
            break
        default:
            break
    }
}

//start game when button pressed
function startGame() {
    gameMenuPopup.style.display = 'none'
    blockRows = []
    chooseBlock()
    displayNextBlock()
    hidePreviousBlock()
    chooseBlock()
    displayNextBlock()
    drawBlockToo()
    goGame()
    document.addEventListener('keydown', pauseGame)
}

//display start game button
function startGameButton() {
    gameMenuPopup.classList.add('game-menu-popup')
    gameMenuPopup.style.display = 'block'
    gameMenuPopup.appendChild(gameDisplay)
    gameDisplay.classList.add('game-display')
    gameDisplay.innerHTML = 'YEAH?'
    gameMenuPopup.appendChild(button)
    button.textContent = 'START'
    button.removeEventListener('click', restartGame)
    button.addEventListener('click', startGame)
}

//reset game to be ready to play again
function resetGame() {
    squares.forEach(square => {
        square.classList.remove(...square.classList);
    });
    rows[19].forEach(element => {
        element.classList.add('bottom-row');
    });
    nextBlockBoxSquares.forEach(nextBlockBoxSquare => {
        nextBlockBoxSquare.classList.remove(...nextBlockBoxSquare.classList);
    });
    totalLinesCleared = 0
    totalScore = 0
    resultDisplay.innerHTML = totalScore
    level = 1
    levelDisplay.innerHTML = level
    intervalLength = 2000
    gameMenuPopup.style.display = 'none'
}

function restartGame() {
    resetGame()
    startGameButton()
}

//display game menu popup and play again button
function gameOver() {
    gameMenuPopup.classList.add('game-menu-popup')
    gameMenuPopup.style.display = 'block'
    gameDisplay.innerHTML = 'GAME OVER'
    button.style.display = 'inline'
    button.textContent = 'PLAY AGAIN'
    document.removeEventListener('keydown', pauseGame)
    document.removeEventListener('keydown', instantDropBlock)
    button.removeEventListener('click', startGame)
    button.addEventListener('click', restartGame)
    stopGame()
    if (squares[3].classList.contains('occupied') ||
        squares[4].classList.contains('occupied') ||
        squares[5].classList.contains('occupied')) {
    
    } else {
        chooseBlock()
        console.log('Last block is', blockName)
        if (blockName == 'iblock') {
            rowOne.forEach(element => {
                squares[element].classList.add(blockName)
            })
        } else {
            rowTwo.forEach(element => {
                squares[element - 10].classList.add(blockName)
                console.log('Square,', element - 10)
            })
        }
    }
    newBlock = true
}

//check if any rows have been filled and if so trigger row clear animation
function fullLineChecker() {
    return new Promise((resolve, reject) => {

        //check if all squares in row are filled
        function checkLine(place) {
            return place.classList.contains('occupied') || place.classList.contains('current-block');
        }

        //animate row clearance
        function iterateInterval(testSquaresArray, delay) {
            return new Promise((resolve, reject) => {
                let columnCount = 0
                let finishedDrops = false
                let intervalId = setInterval(() => {
                    let finishedAnimation = false
                    if (columnCount == testSquaresArray.length && finishedDrops == true) {
                        clearInterval(intervalId)
                        finishedAnimation = true
                        resolve(finishedAnimation); 
                    } else if (columnCount < width) {
                        for (let i = 0; i < testSquaresArray[columnCount].length; i++) {
                            squareNumber = testSquaresArray[columnCount][i]
                            squares[squareNumber].classList.remove('occupied')
                            squares[squareNumber].classList.remove('current-block')
                            for (let j = 0; j < blocks.length; j++) {
                                if (squares[squareNumber].classList.contains(blocks[j].blockLabel)) {
                                    squares[squareNumber].classList.remove(blocks[j].blockLabel)
                                }
                            }
                        }
                        columnCount++
                        if (columnCount == testSquaresArray.length) {
                            dropRows().then((rowsDropped => {
                                finishedDrops = rowsDropped
                            }));
                        }
                    }
                }, delay)
            });
        }

        //animate row drops after row clearance animation
        function dropRows() {
            return new Promise((resolve, reject) => {
                let droppedRowsId = setInterval(() => {
                    let rowsDropped = false
                    emptyRows.forEach(emptyRow => {
                        for (let j = emptyRow - 1; j >= 0; j--) {
                            for (let k = 0; k < width; k++) {
                                let squareNumber = j*10 + k
                                let squareNumberToMoveTo = squareNumber + 10
                                if (squares[squareNumber].classList.contains('occupied') &&
                                    squareNumberToMoveTo < totalSquares) {
                                    squares[squareNumber].classList.remove('occupied')
                                    squares[squareNumberToMoveTo].classList.add('occupied')
                                    for (let l = 0; l < blocks.length; l++) {
                                        if (squares[squareNumber].classList.contains(blocks[l].blockLabel)) {
                                            squares[squareNumber].classList.remove(blocks[l].blockLabel)
                                            squares[squareNumberToMoveTo].classList.add(blocks[l].blockLabel)
                                        }
                                    }
                                }
                            }
                        }
                    })
                    clearInterval(droppedRowsId)
                    rowsDropped = true
                    resolve(rowsDropped);
                }, 200)
            });
        }

        //update score after row clearance
        function scoreTracker() {
            let instanceScore
            switch(emptyRows.length) {
                case 0:
                    break
                case 1:
                    instanceScore = singleLineScore * level
                    break
                case 2:
                    instanceScore = doubleLineScore * level
                    break
                case 3:
                    instanceScore = tripleLineScore * level
                    break
                case 4:
                    instanceScore = quadrupleLineScore * level
                    break
            }
            totalLinesCleared += emptyRows.length
            totalScore += instanceScore
            resultDisplay.innerHTML = totalScore
        }
        
        let testSquaresArray = [[],[],[],[],[],[],[],[],[],[]]
        let emptyRows = []
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].every(checkLine) == true) {
                emptyRows.push(i)
                for (let j = 0; j < rows[j].length; j++) {
                    testSquaresArray[j].push(i*10 + j)
                }
            }
        }

        let returnedPromise = false

        if (testSquaresArray[0].length > 0) {
            iterateInterval(testSquaresArray, 50).then((finishedAnimation => {
                returnedPromise = finishedAnimation
                scoreTracker()
                resolve(returnedPromise)
            }));
        } else {
            returnedPromise = true
            resolve(returnedPromise)
        }
    });
}

//check if block can move down any further
function checkForVerticalCollision() {
    let checkedCollisions
    let checkingLines = false
    return new Promise((resolve, reject) => {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                if (rows[i][j].classList.contains('bottom-row') &&
                    rows[i][j].classList.contains('current-block')) {
                    checkingLines = true
                    blockRowsLooper('remove', 'current-block', 'add', 'occupied')
                    stopGame()
                    intervalLength = savedIntervalLength
                    document.removeEventListener('keydown', pauseGame)
                    fullLineChecker().then((returnedPromise) => {
                        if (returnedPromise == true) {
                            checkedCollisions = returnedPromise
                            hidePreviousBlock()
                            chooseBlock()
                            displayNextBlock()
                            drawBlockToo()
                            newBlock = true
                            goGame()
                            document.addEventListener('keydown', pauseGame)
                            resolve(checkedCollisions)
                        }
                    })
                } else if (i + 1 < rows.length &&
                    rows[i + 1][j].classList.contains('occupied') &&
                    rows[i][j].classList.contains('current-block')) {
                    checkingLines = true
                    blockRowsLooper('remove', 'current-block', 'add', 'occupied')
                    stopGame()
                    intervalLength = savedIntervalLength
                    document.removeEventListener('keydown', pauseGame)
                    fullLineChecker().then((returnedPromise) => {
                        if (returnedPromise == true) {
                            checkedCollisions = returnedPromise
                            if (squares[13].classList.contains('occupied') ||
                                squares[14].classList.contains('occupied') ||
                                squares[15].classList.contains('occupied')) {
                                gameOver()
                                resolve(checkedCollisions)
                            } else {
                                hidePreviousBlock()
                                chooseBlock()
                                displayNextBlock()
                                drawBlockToo()
                                newBlock = true
                                goGame()
                                document.addEventListener('keydown', pauseGame)
                                resolve(checkedCollisions)
                            }
                        }
                    })
                }
            }
        }
        if (checkingLines == false) {
            checkedCollisions = true
            resolve(checkedCollisions)
        }
    });
}

//check if block can move left or right any further
function checkForHorizontalCollision() {
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].length; j++) {
            if (j != 0 && j != 9 &&
                rows[i][j].classList.contains('current-block') &&
                rows[i][j - 1].classList.contains('occupied')) {
                disableArrowLeft = true
                }
            if (j != 0 && j != 9 &&
                rows[i][j].classList.contains('current-block') &&
                rows[i][j + 1].classList.contains('occupied')) {
                disableArrowRight = true
            }
        }
    }
}

//apply block movement before redrawing
function moveBlock(increment, sign) {
    blockRows.forEach(blockRow => {
        for (let i = 0; i < blockRow.length; i++) {
            blockRow[i] += sign*increment
        }
    })
}

//check if block is at left edge of grid
function checkLeftEdge() {
    blockRows.forEach(blockRow => {
        if (blockRow.some(atLeftEdge)) {
            atEdge = true
        }
    })
    if (atEdge == false) {
        moveBlock(1, -1)
    }
    atEdge = false
}

//check if block is at right edge of grid
function checkRightEdge() {
    blockRows.forEach(blockRow => {
        if (blockRow.some(atRightEdge)) {
            atEdge = true
        }
    })
    if (atEdge == false) {
        moveBlock(1, +1)
    }
    atEdge = false
}

//move block left or right one space depending on arrow key input
function lateralMoveBlock(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (disableArrowLeft == false) {
                checkForHorizontalCollision()
                if (disableArrowLeft == true) {
                    break
                }
                removeBlockTooTwo()
                checkLeftEdge()
                drawBlockToo()
                break
                }
        case 'ArrowRight':
            if (disableArrowRight == false) {
                checkForHorizontalCollision()
                if (disableArrowRight == true) {
                    break
                }
                removeBlockTooTwo()
                checkRightEdge()
                drawBlockToo()
                break
            }
    }
    disableArrowLeft = false
    disableArrowRight = false
}

//rotate block clockwise 90 degrees and move block if rotation crosses edge of box
function experimentalBlockRotator(rowOneDistance, rowOneIncrement, rowTwoDistance, rowTwoIncrement) {

    function checkLeftSide(position) {
        return position % 10 <= 4;
    }

    function checkRightSide(position) {
        return position % 10 >= 5;
    }

    let collisionFound = false
    let tempBlockRows = []
    let blockRowOne
    let blockRowTwo
    let leftRightChecker = []
    let leftSide = false
    let rightSide = false

    if (blockRows[0][0] < 10 && blockRows[0][3] < 10) {
        blockRows.forEach(blockRow => {
            for (i = 0; i < blockRow.length; i++) {
                blockRow[i] += 20
            }
        })
    } else if ((blockRows[0][0] > 9 && blockRows[0][0] < 19) &&
               (blockRows[0][3] > 9 && blockRows[0][3] < 19)) {
                blockRows.forEach(blockRow => {
                    for (i = 0; i < blockRow.length; i++) {
                        blockRow[i] += 10
                    }
                })
               }

    blockRows.forEach(blockRow => {
        let tempBlockRow = blockRow.slice()
        tempBlockRows.push(tempBlockRow)
    })

    if (tempBlockRows[0][0] > tempBlockRows[0][1] || tempBlockRows[1][0] > tempBlockRows[1][1]) {
        if (blockName == 'iblock') {
            blockRowOne = tempBlockRows[0].reverse()
            blockRowTwo = tempBlockRows[1].reverse()
        } else {
            blockRowOne = tempBlockRows[0]
            blockRowTwo = tempBlockRows[1]
            rowOneDistance = -rowOneDistance
            rowOneIncrement = -rowOneIncrement
            rowTwoDistance = -rowTwoDistance
            rowTwoIncrement = -rowTwoIncrement
        }
    } else {
        blockRowOne = tempBlockRows[0]
        blockRowTwo = tempBlockRows[1]
    }

    blockRows.forEach(blockRow => {
        for (let i = 0; i < blockRow.length; i++) {
            leftRightChecker.push(blockRow[i])
        }
    })

    if (leftRightChecker.every(checkLeftSide) == true) {
        leftSide = true; rightSide = false
    } else if (leftRightChecker.every(checkRightSide) == true) {
        leftSide = false; rightSide = true
    } else {
        leftSide = false; rightSide = false
    }
    
    for (let i = 0; i < blockRowOne.length; i++) {
        blockRowOne[i] += rowOneDistance
        if (blockRowOne[i] >= 0 && blockRowOne[i] < 200) {
            if (squares[blockRowOne[i]].classList.contains('occupied')) {
                collisionFound = true
            }
            rowOneDistance += rowOneIncrement
        } else {
            collisionFound = true
        }
    }

    for (let j = 0; j < blockRowTwo.length; j++) {
        blockRowTwo[j] += rowTwoDistance
        if (blockRowTwo[j] >= 0 && blockRowTwo[j] < 200) {
            if (squares[blockRowTwo[j]].classList.contains('occupied')) {
                collisionFound = true
            }
            rowTwoDistance += rowTwoIncrement
        } else {
            collisionFound = true
        }
    }

    while (blockRowOne.some(atRightEdge) && leftSide == true ||
           blockRowTwo.some(atRightEdge) && leftSide == true) {
        for (let i = 0; i < blockRowOne.length; i++) {
            blockRowOne[i] += 1
        }
        for (let j = 0; j < blockRowTwo.length; j++) {
            blockRowTwo[j] += 1
        }
    }

    while (blockRowOne.some(atLeftEdge) && rightSide == true ||
           blockRowTwo.some(atLeftEdge) && rightSide == true) {
        for (let i = 0; i < blockRowOne.length; i++) {
            blockRowOne[i] -= 1
        }
        for (let j = 0; j < blockRowTwo.length; j++) {
            blockRowTwo[j] -= 1
        }
    }

    if (collisionFound == false) {
        for (let i = 0; i < tempBlockRows.length; i++) {
            blockRows[i] = tempBlockRows[i].slice()
        }
    }
}

//send rotation arguments to block rotator function after arrow up pressed
function rotateBlockTwo(e) {
    if (e.key == 'ArrowUp') {
        removeBlockTooTwo()
        switch(blockOrientation) {
            case 'horizontal':
                switch(blockName) {
                    case 'iblock':
                        experimentalBlockRotator(-18, 9, 0, 0)
                        break
                    case 'jblock':
                        experimentalBlockRotator(2, 0, -9, 9)
                        break
                    case 'lblock':
                        experimentalBlockRotator(20, 0, -9, 9)
                        break
                    case 'oblock':
                        experimentalBlockRotator(0, 0, 0, 0)
                        break
                    case 'sblock':
                        experimentalBlockRotator(11, 9, -9, 9)
                        break
                    case 'tblock':
                        experimentalBlockRotator(11, 0, -9, 9)
                        break
                    case 'zblock':
                        experimentalBlockRotator(2, 9, 0, 9)
                        break
                }
                blockOrientation = 'vertical'
                break

            case 'vertical':
                switch(blockName) {
                    case 'iblock':
                        experimentalBlockRotator(22, -11, 0, 0)
                        break
                    case 'jblock':
                        experimentalBlockRotator(20, 0, 11, -11)
                        break
                    case 'lblock':
                        experimentalBlockRotator(-2, 0, 11, -11)
                        break
                    case 'oblock':
                        experimentalBlockRotator(0, 0, 0, 0)
                        break
                    case 'sblock':
                        experimentalBlockRotator(9, -11, +11, -11)
                        break
                    case 'tblock':
                        experimentalBlockRotator(9, 0, 11, -11)
                        break
                    case 'zblock':
                        experimentalBlockRotator(20, -11, 0, -11)
                        break
                }
                blockOrientation = 'horizontal'
                if (reversedOrder == true) {
                    reversedOrder = false
                } else if (reversedOrder == false) {
                    reversedOrder = true
                }
                break
        }
        drawBlockToo()
    }
}

function instantDropBlock(e) {
    if (e.key == ' ') {
        stopGame()
        savedIntervalLength = intervalLength
        intervalLength = 1
        goGame()
    }
}

//move block down one row if user presses arrow down key
function dropBlockKey(e) {
    if (e.key == 'ArrowDown') {
        disableArrowLeft = false
        disableArrowRight = false
        checkForVerticalCollision().then((checkedCollisions) => {
            if (checkedCollisions == true) {
                if (newBlock == true) {
                    newBlock = false
                } else {
                    removeBlockTooTwo()
                    moveBlock(10, +1)
                    drawBlockToo()
                    totalScore += 1*level
                    resultDisplay.innerHTML = totalScore
                }
            }
        })
    }
}

//move block down one row after time interval
function dropBlockInterval() {
    checkForVerticalCollision().then((checkedCollisions) => {
        if (checkedCollisions == true) {
            if (newBlock == true) {
                newBlock = false
            } else {
                removeBlockTooTwo()
                moveBlock(10, +1)
                drawBlockToo()
                if (intervalLength == 1) {
                    totalScore += 2*level
                    resultDisplay.innerHTML = totalScore
                }
            }
        }
    })
}

startGameButton()