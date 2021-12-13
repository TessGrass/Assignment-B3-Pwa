const template = document.createElement('template')
template.innerHTML = `
<style>

  .mainwrapper {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.navbar {
  display: flex;
  justify-content: center;
  position:absolute;
  opacity: 90%;
  bottom: 0;
  width: 1000px;
  height: 45px;
  background-color: #C8C8C8;
  border-radius: 15px 15px 0px 0px;
}

.app {
  transition:all .2s ease;
  margin: 8px 5px 25px 30px;
  width: 30px;
  height: 30px;
  background-color: #606060;
  border-radius: 25%;
  border: none;
}

.app:hover {
  background-color: #92C7A3;
  width: 35px;
  height: 35px;

}

img {
  width: 100%;
  max-height: 100%;

}

</style>

<div class="mainwrapper">
<img src = "js/components/desktop-main/grey.jpg">
<div class="navbar">
<button type="button" class="app left"></button>
<button type="button" class="app middle"></button>
<button type="button" class="app right"></button>
<button type="button" class="app right"></button>
</div>
</div>
</div>

`
customElements.define('desktop-main',
  /**
   * 
   */
  class extends HTMLElement {
  /**
   * 
   */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
        this.button = this.shadowRoot.querySelector('button')

      this.button.addEventListener('click', (event) => {
        console.log('i knappen')
      })
    }
  })
