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
    background: url('./images/volumebuttonon.svg')
}

  .volumeoff {
    margin-bottom: 10px;
    height: 35px;  
    width: 30px;
    border: none;
    background-color: white;
    background-size: cover;
    background-image: url('./images/volumebuttonoff.svg')
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
    margin: 0;
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
      this.memoryWrapper.classList.add('inactive')
      this.buttonEasy = this.shadowRoot.querySelector('.easy')
      this.buttonMedium = this.shadowRoot.querySelector('.medium')
      this.buttonHard = this.shadowRoot.querySelector('.hard')
      this.buttonVolume = this.shadowRoot.querySelector('.volumebutton')
      this.buttonVolume.classList.add('inactive')
      this.h1Text = this.shadowRoot.querySelector('h1')
      this.buttonTryAgain = this.shadowRoot.querySelector('#tryagain')
      this.flipUnmatchedCards = this.flipUnmatchedCards.bind(this) // annars hittar vi inte t.ex. this.memorywrapper i funktionen.
      this.hideMatchedCards = this.hideMatchedCards.bind(this)
      this.matchSound = new Audio('images/gamenotis.wav')
      this.matchSound.muted = false

      this.totalTries = 0
      this.sizeOfBoard = 8

      this.images = [{
        name: 'tv',
        img: 'images/tv.png'
      },
      {
        name: 'controller',
        img: 'images/controller.png'
      },
      {
        name: 'cpu2',
        img: 'images/cpu2.png'
      },
      {
        name: 'joystick',
        img: 'images/joystick.png'
      },
      {
        name: 'keyboard',
        img: 'images/keyboard.png'
      },
      {
        name: 'wheel',
        img: 'images/wheel.png'
      },
      {
        name: 'cd',
        img: 'images/cd.png'
      },
      {
        name: 'console',
        img: 'images/console.png'
      }
      ]

      this.buttonEasy.addEventListener('click', (event) => {
        event.preventDefault()
        this.sizeOfBoard = 2
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
        this.buttonVolume.classList.toggle('volumebutton')
        this.buttonVolume.classList.toggle('volumeoff')
      })

      this.buttonTryAgain.addEventListener('click', (event) => {
        event.preventDefault()
        this.restartGame()
        console.log('hej')
      })

      this.activeTiles = []
      this.matchedCards = []
    }

    createTiles() {
      const tiles = []
      this.buttonWrapper.style.display = 'none'
      this.buttonVolume.classList.toggle('inactive')
      this.memoryWrapper.classList.toggle('inactive') // togglar mellan synlig / ej synlig.
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

    handleTiles(data) {
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
          this.buttonTryAgain.classList.toggle('inactive')
        }
        this.activeTiles = []
        this.totalTries++
        this.h1Text.textContent = `Total tries: ${this.totalTries}`
      }
    }

    hideMatchedCards () {
      this.memoryWrapper.style.pointerEvents = 'auto'
      this.dispatchEvent(new CustomEvent('hidematchedcards', {
        bubbles: true,
        composed: true
      }))
    }

    flipUnmatchedCards () {
      this.memoryWrapper.style.pointerEvents = 'auto'
      this.dispatchEvent(new CustomEvent('flipunmatchedcards', {
        bubbles: true,
        composed: true
      }))
    }

    restartGame() {
      this.activeTiles = []
      this.matchedCards = []
      this.buttonTryAgain.classList.toggle('inactive')
      this.memoryWrapper.classList.toggle('active')
      // this.buttonTryAgain.classList.toggle('#tryagain')
      this.buttonWrapper.style.display = 'flex'
      this.memoryWrapper.appendChild(this.buttonWrapper)
    }
  })
