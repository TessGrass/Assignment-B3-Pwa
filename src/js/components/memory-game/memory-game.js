const template = document.createElement('template')
template.innerHTML = `
<style>
  .memorywrapper {
    width: 300px;
    height: 300px;
    margin: auto;
    padding: 25px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    background: #F5F5F5;
  }

  .time {
    flex-direction: row;
    flex-wrap: wrap;  
  }

  .no-click {
    pointer-events: none;
  }  

  input {
    margin-left: 10px;
    justify-content: center;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 1px solid;
  }

  input img {
    width: 50%;
    height: 50%;
  }

  .inactive {
    display: none;
  }

  .active {
    display: flex;
  }

  h1 {
    text-align: center;
    font-size: 20px;
    font-family: "Helvetica" "Arial" "Sans-Serif";
  }

  .volumebutton {
    margin-bottom: 10px;
    left: 50%;
    height: 35px;  
    width: 30px;
    border: none;
    background-size: contain;
    background: url('js/components/memory-game/lib/volumebuttonon.svg')
}

  .volumeoff {
    margin-bottom: 10px;
    height: 35px;  
    width: 30px;
    border: none;
    background-color: white;
    background-size: cover;
    background-image: url('js/components/memory-game/lib/volumebuttonoff.svg')
  }
    
    #volume {
    display: flex;
    justify-content: center;
  }

    #buttonwrapper {
    min-width: 300px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

    #restart {
    margin-top: 5px;
    display: flex;
    justify-content: center;
    align-content: center;
  }

</style>


<div class="memorywrapper"></div>
<form id="restart">
    <input type="button" id="tryagain" value="Try Again" class="inactive">
  </form>
<div class ="time">
<h1></h1>
</div>
<form id="level">
    <div id="buttonwrapper">
        <input type="button" id="easy" value="easy" class="easy">
        <input type="button" id="medium" value="medium" class="medium">
        <input type="button" id="hard" value="hard" class="hard">
    </div>
  </form>
<form id="volume">
    <button type ="button" class="volumebutton"></button>
</form>


`
customElements.define('memory-game',
  /**
   * Terminates the time.
   */
  class extends HTMLElement {
  /**
   * Creates a instance of the current type.
   */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.memoryWrapper = this.shadowRoot.querySelector('.memorywrapper')
      this.buttonWrapper = this.shadowRoot.querySelector('#buttonwrapper')
      this.buttonEasy = this.shadowRoot.querySelector('.easy')
      this.buttonMedium = this.shadowRoot.querySelector('.medium')
      this.buttonHard = this.shadowRoot.querySelector('.hard')
      this.buttonVolume = this.shadowRoot.querySelector('.volumebutton')
      this.buttonTryAgain = this.shadowRoot.querySelector('#tryagain')
      this.h1Text = this.shadowRoot.querySelector('h1')
      this.memoryWrapper.style.display = 'none'
      this.buttonVolume.classList.add('inactive')
      this.flipUnmatchedCards = this.flipUnmatchedCards.bind(this) // annars hittar vi inte t.ex. this.memorywrapper i funktionen.
      this.hideMatchedCards = this.hideMatchedCards.bind(this)
      this.matchSound = new Audio('js/components/memory-game/lib/gamenotis.wav')
      this.gameOverSound = new Audio('js/components/memory-game/lib/applause.wav')
      this.matchSound.muted = false
      this.gameOverSound.muted = false

      this.totalTries = 0
      this.sizeOfBoard = 8

      this.images = [{
        name: 'tv',
        img: 'images/tv.png'
      },
      {
        name: 'controller',
        img: 'js/components/memory-game/lib/controller.png'
      },
      {
        name: 'cpu2',
        img: 'js/components/memory-game/lib/cpu2.png'
      },
      {
        name: 'joystick',
        img: 'js/components/memory-game/lib/joystick.png'
      },
      {
        name: 'keyboard',
        img: 'js/components/memory-game/lib/keyboard.png'
      },
      {
        name: 'wheel',
        img: 'js/components/memory-game/lib/wheel.png'
      },
      {
        name: 'cd',
        img: 'js/components/memory-game/lib/cd.png'
      },
      {
        name: 'console',
        img: 'js/components/memory-game/lib/console.png'
      }
      ]

      this.buttonEasy.addEventListener('click', (event) => {
        event.preventDefault()
        this.sizeOfBoard = 2
        this.memoryWrapper.style.width = '300px'
        this.memoryWrapper.style.height = '300px'
        this.createTiles()
      })

      this.buttonMedium.addEventListener('click', (event) => {
        event.preventDefault()
        this.sizeOfBoard = 4
        this.memoryWrapper.style.width = '600px'
        this.memoryWrapper.style.height = '300px'
        this.createTiles()
      })

      this.buttonHard.addEventListener('click', (event) => {
        event.preventDefault()
        this.sizeOfBoard = 8
        this.memoryWrapper.style.width = '600px'
        this.memoryWrapper.style.height = '600px'
        this.createTiles()
      })

      this.buttonVolume.addEventListener('click', (event) => {
        event.preventDefault()
        this.matchSound.muted = !this.matchSound.muted
        this.gameOverSound.muted = !this.gameOverSound.muted
        this.buttonVolume.classList.toggle('volumebutton')
        this.buttonVolume.classList.toggle('volumeoff')
      })

      this.buttonTryAgain.addEventListener('click', (event) => {
        event.preventDefault()
        this.restartGame()
      })

      this.activeTiles = []
      this.matchedCards = []
    }

    /**
     * Create tiles for the game.
     */
    createTiles () {
      const tiles = []
      this.buttonWrapper.style.display = 'none'
      this.buttonVolume.style.display = 'flex'
      this.memoryWrapper.style.display = 'flex' // togglar mellan synlig / ej synlig.
      for (let i = 0; i < this.sizeOfBoard; i++) {
        for (let j = 0; j < 2; j++) { // för varje yttre iteration så görs två iterationer och flipping-tile skapas
          const tile = document.createElement('flipping-tile')
          const image = document.createElement('img')
          image.slot = 'front'
          image.src = this.images[i].img // slottar in bilden som befinner sig på indexet
          image.alt = this.images[i].name // slottar in namnet (alt) som befinner sig på indexet
          image.id = j // Ger elementet ett id för att kunna se exakt vilket kort som är tryckt, skiftar mellan 0 och 1. (för att undvika dubbeltryckning på samma kort som annars skulle ge rätt)
          tile.appendChild(image)
          tiles.push({
            tile: tile,
            random: Math.random()
          })
          tile.addEventListener('activeTile', (event) => this.handleTiles({ // triggar ett event och skickar med det som återfinns i detail
            detail: {
              alt: image.alt,
              id: image.id
            }
          }))
        }
      }
      tiles.sort((a, b) => a.random - b.random)
      tiles.forEach(tile => {
        this.memoryWrapper.append(tile.tile)
      })
    }

    /**
     * Compares two flipped cards.
     *
     * @param {object} data - receives data from createTiles method.
     */
    handleTiles (data) {
      this.activeTiles.push(data.detail)
      if (this.activeTiles.length === 2) {
        this.memoryWrapper.style.pointerEvents = 'none'
        if (this.activeTiles[0].alt === this.activeTiles[1].alt && this.activeTiles[0].id !== this.activeTiles[1].id) { // så att inte två tryck på samma kort resulterar i rätt svar
          this.matchedCards.push(this.activeTiles)
          this.matchSound.play()
          setTimeout(this.hideMatchedCards, 1000)
        } else {
          setTimeout(this.flipUnmatchedCards, 1000)
        }
        if (this.matchedCards.length === this.sizeOfBoard) {
          this.matchSound.remove()
          this.gameOverSound.play()
          this.buttonTryAgain.classList.toggle('inactive')
        }
        this.activeTiles = []
        this.totalTries++
        this.h1Text.textContent = `Total tries: ${this.totalTries}`
      }
    }

    /**
     *
     */
    hideMatchedCards () {
      this.memoryWrapper.style.pointerEvents = 'auto'
      this.dispatchEvent(new CustomEvent('hidematchedcards', {
        bubbles: true,
        composed: true
      }))
    }

    /**
     *
     */
    flipUnmatchedCards () {
      this.memoryWrapper.style.pointerEvents = 'auto'
      this.dispatchEvent(new CustomEvent('flipunmatchedcards', {
        bubbles: true,
        composed: true
      }))
    }

    /**
     * Restarts the game.
     */
    restartGame () {
      this.activeTiles = []
      this.matchedCards = []
      this.totalTries = 0
      this.h1Text.textContent = ''
      this.buttonTryAgain.classList.toggle('inactive')
      this.memoryWrapper.innerHTML = ''
      this.memoryWrapper.style.display = 'none'
      this.buttonWrapper.style.display = 'flex'
    }
  })
