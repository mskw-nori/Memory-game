'use strict'

{
  const marks = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H']
  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] = [arr[i], arr[j]]
    }
    return arr;
  }

  const gameInformation = {
    turnPlayer: 1,
    scores: {
      player1: 0,
      player2: 0
    },
    openedCards: []
  }

  const addScore = () => {
    const { turnPlayer } = gameInformation
    const taurnPlayerScore = gameInformation.scores[`player${turnPlayer}`]
    gameInformation.scores[`player${turnPlayer}`] = taurnPlayerScore + 1

    const targetScoreEl = document.querySelector(`#score-${turnPlayer}`)
    targetScoreEl.textContent = gameInformation.scores[`player${turnPlayer}`]
  }

  const changeTurnPlayer = () => {
    const nextPlayerNumber = gameInformation.turnPlayer === 1 ? 2 : 1
    gameInformation.turnPlayer = nextPlayerNumber

    const playersEl = document.querySelectorAll('.player-info')
    playersEl.forEach(player => {
      player.classList.remove('player-info--playing')
      const isNextPlayer = player.classList.contains(`player${nextPlayerNumber}`)
      if (isNextPlayer) {
        player.classList.add('player-info--playing')
      }
    })
  }

  const alermWinnerEl = document.querySelector('.winner-information')

  const announceWinner = () => {
    addScore()
    const { player1, player2 } = gameInformation.scores
    const winner = (() => {
      switch (true) {
        case player1 === player2:
          return '引き分け'
        case player1 > player2:
          return 'Player1の勝利'
        default:
          return 'Player2の勝利'
      }
    })()
    alermWinnerEl.textContent = winner
    alermWinnerEl.classList.remove('winner-information--hide')
  }

  const openCard = forwardEvent => {
    const cardEl = forwardEvent.currentTarget

    const isOpenedCard = cardEl.classList.contains('card--open')
    const isCompletedCard = cardEl.classList.contains('card--complete')
    const isProcessing = gameInformation.openedCards.length === 2
    if (isOpenedCard || isCompletedCard || isProcessing) {
      return
    }
    
    cardEl.classList.add('card--open')
    
    const { mark } = cardEl.dataset
    gameInformation.openedCards = [...gameInformation.openedCards, mark]

    const isFirstCard = gameInformation.openedCards.length === 1 
    if (isFirstCard) {
      return
    }

    const isMatchingCards = gameInformation.openedCards.every((card, _, [firstCard]) => card === firstCard) // everyで配列の１番目と２番目を比較、合っていたらtrueを返す

    setTimeout(() => {
      const openedCardsEl = document.querySelectorAll('.card--open')
      openedCardsEl.forEach(card => {
        if (isMatchingCards) {
          card.classList.add('card--complete')
        }
        card.classList.remove('card--open')
      })

      const allCardsEl = document.querySelectorAll('.card')
      const isFinishedGame = Array.from(allCardsEl).every(card => card.classList.contains('card--complete')) // Aray.from()で引数を配列のように扱える
      const finishTurnAfterProcess = isMatchingCards ? (isFinishedGame ? announceWinner : addScore) : changeTurnPlayer
      finishTurnAfterProcess()

      gameInformation.openedCards = []
    }, 1500)
  }

  const dealCards = () => {
    const shuffledMarks = shuffle(marks)
    const cardAreaEl = document.querySelector('.card-area')
    
    while (cardAreaEl.firstChild) {
      cardAreaEl.removeChild(cardAreaEl.firstChild)
    }
    
    shuffledMarks.forEach(mark => {
      const cardEl = document.createElement('div')
      const cardInnerEl = document.createElement('div')
      const cardFrontEl = document.createElement('div')
      const cardBackEl = document.createElement('div')

      cardEl.classList.add('card')
      cardInnerEl.classList.add('card__inner')
      cardFrontEl.classList.add('card__front')
      cardBackEl.classList.add('card__back')

      cardBackEl.textContent = mark

      cardInnerEl.appendChild(cardFrontEl)
      cardInnerEl.appendChild(cardBackEl)
      cardEl.appendChild(cardInnerEl)
      cardEl.setAttribute('data-mark', mark)
      cardEl.addEventListener('click', openCard)
      
      cardAreaEl.appendChild(cardEl)
    })
  }

  const startGame = () => {
    const isProcessing = gameInformation.openedCards.length === 2
    if (isProcessing) {
      return
    }

    gameInformation.turnPlayer = 1
    
    gameInformation.scores.player1 = 0
    gameInformation.scores.player2 = 0
    const score1El = document.querySelector('#score-1')
    const score2El = document.querySelector('#score-2')
    score1El.textContent = 0
    score2El.textContent = 0
    
    gameInformation.openedCards = []

    alermWinnerEl.classList.add('winner-information--hide')

    const playersEl = document.querySelectorAll('.player-info')
    playersEl.forEach((player) => player.classList.remove('player-info--playing'))
    const player1El = document.querySelector('.player1')
    player1El.classList.add('player-info--playing')

    dealCards()
  }

  const startButtonEl = document.querySelector('#start-button')
  startButtonEl.addEventListener('click', startGame)
}
