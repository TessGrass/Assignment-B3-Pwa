const template = document.createElement('template')
template.innerHTML = `
<style>
    #divwindow {
        position: absolute;
        width: 500px;
        
        background-color: #C8C8C8;
        border-radius: 10px;       
    }
    
    #divcontent {
      width: 500px;
      height: 500px;
      pointer-events: none;
      background-color: #C8C8C8;
      z-index: 4000;
    }

    #divheader {
        cursor: pointer;
        background-color: #92C7A3;
        text-align: right;
        width: 500px;
        height: 25px;
        z-index: 2000;
    }

    button {
      background-color: #92C7A3;
      border: none;
      text-align: center;
    }

    button:hover {
      background-color: #588566;
      font-size: 20px;
    }
</style>
<div id="divwindow">
    <div id="divheader"><button>X</button></div>
    <div id="divcontent">sdg</div>
</div>

`
customElements.define('desktop-window',
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
      const draggableElement = this.shadowRoot.querySelector('#divwindow')
      this.divContent = this.shadowRoot.querySelector('#divcontent')
      this.header = this.shadowRoot.querySelector('#divheader')
      this.button = this.shadowRoot.querySelector('button')

      this.button.addEventListener('click', (event) => {
        draggableElement.style.display = 'none'
      })


      draggableElement.addEventListener('mousedown', mousedown)
      this.divContent.style.pointerEvents = 'none'
      /**
       * @param event
       */
      function mousedown (event) {
        addEventListener('mousemove', mousemove)
        addEventListener('mouseup', mouseup)

        let prevX = event.clientX
        let prevY = event.clientY

        /**
         * @param event
         */
        function mousemove (event) {
          const newX = prevX - event.clientX
          const newY = prevY - event.clientY

          const rect = draggableElement.getBoundingClientRect()

          draggableElement.style.left = rect.left - newX + 'px'
          draggableElement.style.top = rect.top - newY + 'px'

          prevX = event.clientX
          prevY = event.clientY
        }
        /**
         *
         */
        function mouseup () {
          window.removeEventListener('mousemove', mousemove)
          window.removeEventListener('mouseup', mouseup)
        }
      }

      /*  mousedown(e) {
      addEventListener('mousemove', mouseMove)
      addEventListener('mouseup', mouseUp)

      const prevX = e.clientX
      const prevY = e.clientY

      const mouseMove = (e) => {
        const newX = prevX - e.clientX
        const newY = prevY - e.clientY

        const rect = this.divWindow.getBoundingClientRect()

        this.divWindow.style.left = rect.left - newX + 'px'
        this.divWindow.style.top = rect.top - newY + 'px'

        this.prevX = e.clientX
        this.prevY = e.clientY
      }

        function mouseUp() {

        }
    } */
    }
  })
