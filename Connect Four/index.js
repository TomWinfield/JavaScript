document.addEventListener('DOMContentLoaded', () => 
{
    const boxes = document.querySelectorAll('.grid div:not(.circle)')
    console.log(boxes.length)

    const circles = document.querySelectorAll('.box div')
    const result = document.querySelector('#result')
    const displayCurrentPlayer = document.querySelector('#current-player')
    let currentPlayer = 1
    let winningArrays = []
    let winner = false
    console.log(boxes)
    console.log(circles)

    function checkBoard() {
        console.log('Checking Board')
        for (let y = 0; y < winningArrays.length; y++) {
            const circle1 = circles[winningArrays[y][0]]
            const circle2 = circles[winningArrays[y][1]]
            const circle3 = circles[winningArrays[y][2]]
            const circle4 = circles[winningArrays[y][3]]

            //check those squares to see if they all have the class of player-one
            if (
                circle1.classList.contains('player-one') &&
                circle2.classList.contains('player-one') &&
                circle3.classList.contains('player-one') &&
                circle4.classList.contains('player-one')
            )
            {
                winner = true
                result.innerHTML = 'Player One Wins!'
            }
            //check those squares to see if they all have the classof player-two
            if (
                circle1.classList.contains('player-two') &&
                circle2.classList.contains('player-two') &&
                circle3.classList.contains('player-two') &&
                circle4.classList.contains('player-two')
            )
            {
                winner = true
                result.innerHTML = 'Player Two Wins!'
            }
        }
    }

    //populate winning arrays
    for (let i = 0; i < boxes.length - 7; i++) {
        if (((i + 3) % 7 != 0) && ((i + 2) % 7 != 0) && ((i + 1) % 7 != 0)) {
            tempArray = [i, i+1, i+2, i+3]
            winningArrays.push(tempArray)
        }
        if (i + 21 < boxes.length - 7) {
            if (boxes[i + 21].classList.contains('bottom') == false) {
                tempArray = [i, i+7, i+14, i+21]
                winningArrays.push(tempArray)
            }
        }
        if (i + 25 < boxes.length - 7) {
            if (((i + 1) % 7 != 0) && ((i + 9) % 7 != 0) && ((i + 17) % 7 != 0)) {
                tempArray = [i, i+8, i+16, i+24]
                winningArrays.push(tempArray)
            }
        }
        if (i + 18 < boxes.length - 7) {
            if (((i) % 7 != 0) && ((i - 1) % 7 != 0) && ((i - 2) % 7 != 0)) {
                tempArray = [i, i+6, i+12, i+18]
                winningArrays.push(tempArray)
            }
        }
    }

    for (let i = 0; i < circles.length; i++) {
        circles[i].onclick = () => {
            //if the square below your current square is taken you can go on top of it
            if (boxes[i + 7].classList.contains('taken') &&!
                circles[i].classList.contains('taken')
            ) {
                if (currentPlayer == 1) {
                    boxes[i].classList.add('taken')
                    circles[i].classList.add('player-one')
                    currentPlayer = 2
                    displayCurrentPlayer.innerHTML = currentPlayer
                } else if (currentPlayer == 2) {
                    boxes[i].classList.add('taken')
                    circles[i].classList.add('player-two')
                    currentPlayer = 1
                    displayCurrentPlayer.innerHTML = currentPlayer
                }
                let circleClassList = []
                for (item of circles[i].classList.values()) {
                    circleClassList.push(item)
                }
                console.log('Circle ' + i + ': ', circleClassList)
            } else alert("Box " + i)
            checkBoard()
        }
    }
})