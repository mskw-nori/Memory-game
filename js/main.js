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
          return 'player1の勝利'
        default:
          return 'player2の勝利'
      }
    })()
    alermWinnerEl.textContent = winner
    alermWinnerEl.classList.remove('winner-information--hide')
    // alert(winner)
  }

  const openCard = forwardEvent => {
    const isOpenedCard = forwardEvent.target.classList.contains('card--open') // クリックしたカードにクラスが付いているかどうかの条件として
    const isCompletedCard = forwardEvent.target.classList.contains('card--complete')
    const isPlayedTurn = gameInformation.openedCards.length === 2
    if (isOpenedCard || isCompletedCard || isPlayedTurn) {
      return
    }
    
    const { mark } = forwardEvent.target.dataset // data-setで保持しているマークをテキストとして表示する
    forwardEvent.target.textContent = mark
    forwardEvent.target.classList.add('card--open') // 選択済み状態へ

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
        } else {
          card.textContent = '' // カードが揃わなかったらテキストを非表示に
        }
        card.classList.remove('card--open') // 選択済み状態のリセット
      })

      const allCardsEl = document.querySelectorAll('.card')
      const isFinishedGame = Array.from(allCardsEl).every(card => card.classList.contains('card--complete')) // Aray.from()で引数を配列のように扱える
      const finishTurnAfterProcess = isMatchingCards ? (isFinishedGame ? announceWinner : addScore) : changeTurnPlayer
      finishTurnAfterProcess()

      gameInformation.openedCards = [] // 選択回数のリセット
    }, 1500) // 二枚目のマークが見れるように表示時間の設定
  }

  const dealCards = () => {
    const shuffledMarks = shuffle(marks)
    const cardAreaEl = document.querySelector('.card-area')
    
    while (cardAreaEl.firstChild) { // 配置されているカードを消去
      cardAreaEl.removeChild(cardAreaEl.firstChild)
    }
    
    shuffledMarks.forEach(mark => {
      const cardEl = document.createElement('div')
      cardEl.classList.add('card')
      cardEl.setAttribute('data-mark', mark) //初期状態ではマークを表示させない様に、data-setとして保持
      cardEl.addEventListener('click', e => openCard(e))
      cardAreaEl.appendChild(cardEl)
    })
  }

  const startGame = () => {
    gameInformation.turnPlayer = 1
    
    gameInformation.scores.player1 = 0
    gameInformation.scores.player2 = 0
    const score1El = document.querySelector('#score-1')
    const score2El = document.querySelector('#score-2')
    score1El.textContent = 0
    score2El.textContent = 0
    
    gameInformation.openedCards = []

    alermWinnerEl.textContent = ''
    alermWinnerEl.classList.add('winner-information--hide')

    const playersEl = document.querySelectorAll('.player-info')
    playersEl.forEach((player) => player.classList.remove('player-info--playing'))
    
    const firstPlayerEl = document.querySelector('.player1')
    firstPlayerEl.classList.add('player-info--playing')

    dealCards()
  }

  const startButtonEl = document.querySelector('#start-button')
  startButtonEl.addEventListener('click', startGame)
}
