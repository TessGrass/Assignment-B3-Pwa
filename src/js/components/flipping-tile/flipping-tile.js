
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
      max-width: 120px;
      max-height: 120px;
      margin: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
      transform-style: preserve-3d;      
    }

    .inactive {
      visibility: hidden;
    }

    ::slotted(img){
      transition: transform 0,5s;
      transform-style: preserve-3d;      
      max-width: 100%;
      max-height: 100%;
      border-radius: 18%;
      
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }

    #back {
      border-radius: 18%;
      background: #D8D8D8;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 120px;
      max-height: 120px;
    }

    #front {
      border-radius: 20%;
      justify-content: center;
      position:fixed;
      transform: rotateY(180deg);
    }

    .flipCard {
     transform: rotateY(180deg);
    }

    #front, #back {
    backface-visibility: hidden;
    }

    button {
    border: none;
    background: none;
    }

    button:focus {
      background: #ff0000;
    }

    .noclick {
      pointer-events: none;
    }

</style>
<div part="flipping" id="container">
    <button type="button" class="noclick" id="front"><slot name="front" id="frontcard"></slot></button>
    <button type="button" id="back"><img src="images/0.png"></button>
</div>
`
customElements.define('flipping-tile',
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

      this.container = this.shadowRoot.querySelector('#container')
      this.frontCard = this.shadowRoot.querySelector('#frontcard')
      this.backCard = this.shadowRoot.querySelector('#back')
      this.flipCard = this.shadowRoot.querySelector('.flipCard')
      this.activeCard = false
      this.frontCard.classList.add('inactive')

      this.addEventListener('click', (event) => {
        console.log('i clicket')
        this.container.classList.toggle('flipCard')
        this.frontCard.classList.toggle('inactive')
        this.backCard.classList.toggle('inactive')
        this.activeCard = !this.activeCard // växlar mellan sant / falskt
        this.activeCard && this.dispatchEvent(new CustomEvent('activeTile', { // om kortet är true
          detail: {
            alt: this.querySelector('img').getAttribute('alt')
          }
        }))
      })
      addEventListener('hidematchedcards', (event) => {
        if (this.frontCard.classList.value !== 'inactive') {
          this.style.visibility = 'hidden'
          console.log(this.frontCard)
        }
      })

      addEventListener('flipunmatchedcards', (event) => {
        if (this.frontCard.classList.value !== 'inactive') {
          this.container.classList.toggle('flipCard')
          this.frontCard.classList.toggle('inactive')
          this.backCard.classList.toggle('inactive')
          this.activeCard = !this.activeCard
        }
      })
    }
  })

// <div part="back" id="back"><slot name="back"></slot></div>
