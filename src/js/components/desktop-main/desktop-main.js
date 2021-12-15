const template = document.createElement('template')
template.innerHTML = `
<style>

  .mainwrapper {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position-y: center;
  background-image: url("js/components/desktop-main/lib/grey.jpg")
}

.appearance {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-size: 100vw 100vh;
  background-image: url("js/components/desktop-main/lib/leaves.jpg");
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
  margin: 8px 5px 25px 20px;
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

.visible{
  visibility: hidden;
}

.switch {
  margin-left: 1420px;
  position: absolute;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  border-radius: 20%;
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(260px);
  transform: translateX(26px);
}

.position {
  display: flex;
  justify-content: left;
}

</style>

<div class="mainwrapper">
<label class="switch">
  <input type="checkbox">
  <span class="slider round"></span>
</label>

<div class="window"></div>
<div class="navbar">
<button type="button" class="app left"></button>
<button type="button" class="app middle"></button>
<button type="button" class="app right"></button>
<button type="button" class="app far-right"></button>
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
      this.mainWrapper = this.shadowRoot.querySelector('.mainwrapper')
      this.window = this.shadowRoot.querySelector('.window')
      this.slider = this.shadowRoot.querySelector('input')
      this.windowContainer = []
      this.value = 1

      this.button.addEventListener('click', (event) => {
        event.stopPropagation()
        this.desktopWindow = document.createElement('desktop-window')
        this.desktopWindow.id = this.value++
        this.window.appendChild(this.desktopWindow)
        /* this.windowContainer.forEach(window => {
          window.style.margin = this.margin++
          console.log(window.style.margin)
        }) */
        this.windowContainer.push(this.desktopWindow)
        this.desktopWindow.addEventListener('click', (event) => {
          this.windowContainer.forEach(window => {
            window.focus(window === event.target)
          })
        })
          //////////

        // console.log(this.windowContainer.this.window.id)
      })

      this.slider.addEventListener('click', (event) => {
        console.log('click')
        this.mainWrapper.classList.toggle('appearance')
        /* if (this.mainWrapper.style.background === 'url("js/components/desktop-main/lib/grey.jpg")') {
          this.mainWrapper.style.background = 'url("js/components/desktop-main/lib/green.jpg")'
        } else {
          this.mainWrapper.style.background = 'url("js/components/desktop-main/lib/grey.jpg")'
        } */
      })
    }
  })
  // spara ner alla fönster som skapas i en array, när ett fönster klickas så utlöser fönstret ett event som lyssnas på här. När det eventet körs så ska arrayen loopas och sätta z-index på alla fönster.
  // array.map((window, index) => {
  // if(index === det klickade fönstret) {
    // z-index = 200, annars 100
  
