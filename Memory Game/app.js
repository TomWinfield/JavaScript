const cardArray = [
    {
        name: 'emu',
        img: 'images/Emu.jpg'
    },
    {
        name: 'goose',
        img: 'images/Goose.jpg'
    },
    {
        name: 'kingfisher',
        img: 'images/Kingfisher.jpg'
    },
    {
        name: 'penguin',
        img: 'images/Penguin.jpg'
    },
    {
        name: 'pigeon',
        img: 'images/Pigeon.jpg'
    },
    {
        name: 'toucan',
        img: 'images/Toucan.jpg'
    },
    {
        name: 'emu',
        img: 'images/Emu.jpg'
    },
    {
        name: 'goose',
        img: 'images/Goose.jpg'
    },
    {
        name: 'kingfisher',
        img: 'images/Kingfisher.jpg'
    },
    {
        name: 'penguin',
        img: 'images/Penguin.jpg'
    },
    {
        name: 'pigeon',
        img: 'images/Pigeon.jpg'
    },
    {
        name: 'toucan',
        img: 'images/Toucan.jpg'
    }
]

cardArray.sort(() => 0.5 - Math.random())

const gridDisplay = document.querySelector('#grid')
const resultDisplay = document.querySelector('#result')
let cardsChosen = []
let cardsChosenIds = []
const cardsWon = []

function creatBoard() {
    for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('img')
        card.setAttribute('src', 'images/Tile.jpg')
        card.setAttribute('data-id', i)
        card.addEventListener('click', flipCard)
        gridDisplay.appendChild(card)
    }
}

creatBoard()

function checkMatch() {
    const cards = document.querySelectorAll('#grid img')
    const optionOneId = cardsChosenIds[0]
    const optionTwoId = cardsChosenIds[1]
    console.log(cards)
    console.log('check for match')
    if(optionOneId == optionTwoId) {
        cards[optionOneId].setAttribute('src', 'images/Tile.jpg')
        cards[optionTwoId].setAttribute('src', 'images/Tile.jpg')
        alert('You have clicked the same image!')
    }
    if (cardsChosen[0] == cardsChosen[1]) {
        alert('You found a match!')
        cards[optionOneId].setAttribute('src', 'images/White.png')
        cards[optionTwoId].setAttribute('src', 'images/White.png')
        cards[optionOneId].removeEventListener('click', flipCard)
        cards[optionTwoId].removeEventListener('click', flipCard)
        cardsWon.push(cardsChosen)
    } else{
        cards[optionOneId].setAttribute('src', 'images/Tile.jpg')
        cards[optionTwoId].setAttribute('src', 'images/Tile.jpg')
        alert('Sorry try again!')
    }
    resultDisplay.textContent = cardsWon.length
    cardsChosen = []
    cardsChosenIds = []

    if (cardsWon.length == cardArray.length/2) {
        resultDisplay.innerHTML = 'Congratulations you won!'
    }
}

function flipCard() {
    let cardId = this.getAttribute('data-id')
    cardsChosen.push(cardArray[cardId].name)
    cardsChosenIds.push(cardId)
    console.log(cardsChosen)
    console.log(cardsChosenIds)
    this.setAttribute('src', cardArray[cardId].img)
    if (cardsChosen.length === 2) {
        setTimeout(checkMatch, 500)
    }
}