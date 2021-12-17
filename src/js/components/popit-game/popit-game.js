const template = document.createElement('template')
template.innerHTML = `
<style>
  #gamewrapper {
      display: flex;
      flex-wrap: nowrap;
    width: 420px;
    height: 500px;
    background: blue;
  }

  .vertical {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-item: center;
      padding-left: 5px;
      width: 70px;
      height: 500px;
      box-shadow: inset 0px 0px 10px rgba(0,0,0,0.5)
  }

  #bubble {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: red;
      background-image: radial-gradient(#e0b2b2, red, #e50000);
  }

  #bubble-pop {
    width: 55px;
      height: 55px;
      border-radius: 50%;
      background: red;
      background-image: radial-gradient(#cc0000, #cc0000, #660000); // inre mitten yttre
      box-shadow: inset 10px 0px 0px rgba(255,255,255,0)

  }
</style>
<div id="gamewrapper">
<div id="red" style="background-color: #e50000" class="vertical"><div id="bubble"></div><div id="bubble-pop"></div></div>
<div id="orange" style="background-color: orange" class="vertical"></div>
<div id="yellow" style="background-color: yellow" class="vertical"></div>
<div id="green" style="background-color: green" class="vertical"></div>
<div id="blue" style="background-color: blue" class="vertical"></div>
<div id="purple" style="background-color: purple" class="vertical"></div>
</div>
`
customElements.define('popit-game',
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

      this.addEventListener('click', (event) => {
      })
    }
  })