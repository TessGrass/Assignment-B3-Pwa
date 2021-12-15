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

.alternatemain {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-size: 100vw 100vh;
  background-image: url("js/components/desktop-main/lib/leaves.jpg");
}

.alternatenavbar {
  display: flex;
  justify-content: center;
  position:absolute;
  bottom: 0;
  width: 1000px;
  height: 45px;
  background-color: rgba(15,6,54,0.8);
  border-radius: 15px 15px 0px 0px;
  box-shadow:
    0 0 20px 5px #fff,  /* inner white */
    0 0 30px 20px #6134A7, /* middle magenta */
    0 0 14px 10px #0ff;
}

.alternateapp {
  transition:all .2s ease;
  margin: 8px 5px 25px 20px;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 25%;
  border: none;

}

.alternateapp:hover {
  opacity: 100%;
  background-color: #fff;
  width: 35px;
  height: 35px;
}

.navbar {
  display: flex;
  justify-content: center;
  position:absolute;
  bottom: 0;
  width: 1000px;
  height: 45px;
  background-color: rgba(200,200,200,0.8);
  border-radius: 15px 15px 0px 0px;
}

.navbar .app {  
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
  background-color: #0F0636;
}

input:focus + .slider {
  box-shadow: 0 0 1px #0F0636;
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
<button type="button" class="app"></button>
<button type="button" class="app"></button>
<button type="button" class="app"></button>
<button type="button" class="app"></button>
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
      this.apps = this.shadowRoot.querySelectorAll('.app')
      this.mainWrapper = this.shadowRoot.querySelector('.mainwrapper')
      this.window = this.shadowRoot.querySelector('.window')
      this.slider = this.shadowRoot.querySelector('input')
      this.navbar = this.shadowRoot.querySelector('.navbar')
      this.windowContainer = []
      this.value = 1

      this.button.addEventListener('click', (event) => {
        event.stopPropagation()
        this.desktopWindow = document.createElement('desktop-window')
        this.desktopWindow.id = this.value++
        // this.desktopWindow.shadowRoot.querySelector('#divwindow').style.left = 100 + (this.value * 10) + 'px' // adjusting window position
        // this.desktopWindow.shadowRoot.querySelector('#divwindow').style.top = 100 + (this.value * 15) + 'px' // adjusting window position
        this.window.appendChild(this.desktopWindow)
        this.windowContainer.push(this.desktopWindow)

        this.desktopWindow.addEventListener('click', (event) => {
          this.windowContainer.forEach(window => {
            window === event.target ? window.setZindexTo('3000') : window.setZindexTo('2000')
          })
        })
      })

      this.slider.addEventListener('click', (event) => {
        console.log('click')
        this.mainWrapper.classList.toggle('alternatemain')
        if (this.navbar.className === 'navbar') {
          this.apps.forEach(app => {
            app.removeAttribute('app')
            app.setAttribute('class', 'alternateapp')
            this.navbar.classList.remove('navbar')
            this.navbar.classList.add('alternatenavbar')
          })
        } else {
          this.apps.forEach(app => {
            app.removeAttribute('alternateapp')
            app.setAttribute('class', 'app')
            this.navbar.classList.remove('alternatenavbar')
            this.navbar.classList.add('navbar')
          })
        }
      })
    }
  })
