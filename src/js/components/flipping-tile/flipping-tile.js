
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
      background: #DADADA;
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

    .noclick {
      pointer-events: none;
    }

</style>
<div part="flipping" id="container">
    <button type="button" class="noclick" id="front"><slot name="front" id="frontcard"></slot></button>
    <button type="button" id="back"><img src="js/components/flipping-tile/lib/0.png"></button>
</div>
`
customElements.define('flipping-tile',
  /**
   * Creates a flipping tile component.
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
      this.frontCard.classList.add('inactive')
      this.activeCard = false

      this.addEventListener('click', (event) => { // listens for clicked tile.
        this.container.classList.toggle('flipCard')
        this.frontCard.classList.toggle('inactive')
        this.backCard.classList.toggle('inactive')
        this.activeCard = !this.activeCard // Flips between true / false
        this.activeCard && this.dispatchEvent(new CustomEvent('activeTile', { // if the card is true -> activeTiles fires to memorygame component.
          detail: {
            alt: this.querySelector('img').getAttribute('alt') // name of the flipping card.
          }
        }))
      })
    }

    /**
     * Hides the matched cards.
     *
     */
    hideMatchedCard () {
      this.style.visibility = 'hidden'
    }

    /**
     * Flips unmatched cards.
     *
     */
    flippedUnmatchedCard () {
      this.container.classList.toggle('flipCard')
      this.frontCard.classList.toggle('inactive')
      this.backCard.classList.toggle('inactive')
      this.activeCard = !this.activeCard
    }
  })
