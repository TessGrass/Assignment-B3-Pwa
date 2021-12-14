const template = document.createElement('template')
template.innerHTML = `
<style>
    #divwindow {
      position: absolute;
      width: 500px;
      height: 30px;
      border-radius: 10px;       
    }

    #divheader {
      display: flex;
      justify-content: right;
      cursor: pointer;
      background-color: #92C7A3;
      text-align: right;
      width: 500px;
      height: 30px;
      z-index: 2000;
    }
    
    #divcontent {
      width: 500px;
      height: 500px;
      background-color: #C8C8C8;
      border-radius: 0px 0px 10px 10px;
    }


    button {
      background-color: #92C7A3;
      border: none;
    }

    button:hover {
      text-align: center;
      background-color: #588566;
      font-size: 20px;
    }
</style>
<div id="divwindow">
    <div id="divheader"><button>X</button></div>
    <div id="divcontent"></div>
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
      this.zIndex = 100

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

        let prevX = event.clientX // where the mouse is positioned when clicked
        let prevY = event.clientY

        /**
         * @param event
         */
        function mousemove (event) {
          const newX = prevX - event.clientX // difference between old position and new position
          const newY = prevY - event.clientY
          const widthValue = 508
          const heightValue = 540

          const rect = draggableElement.getBoundingClientRect() // checks where the object is positioned in the viewport (domRect)
          if (rect.x < 0) { // found in domRect, x = 0 is the furthers to the left.
            rect.x = 0
            prevX = 0
          } else if (rect.x + widthValue > window.innerWidth) { // if X and widthValue is greater than Window.innerWidth the x-value is reduced with widthValue
            rect.x = window.innerWidth - widthValue
            prevX = window.innerWidth - widthValue
          }
          if (rect.x >= 0 && rect.x <= window.innerWidth - widthValue) { // if rect x is smaller than 0 AND the innerwith - widthValue, the window can't be moved further outside.
            draggableElement.style.left = rect.left - newX + 'px'
            prevX = event.clientX
          }

          if (rect.y < 0) {
            rect.y = 0
            prevY = 0
          } else if (rect.y + heightValue > innerHeight) {
            rect.y = window.innerHeight - heightValue
            prevY = window.innerHeight - heightValue
          }
          if (rect.y >= 0 && rect.y <= window.innerHeight - heightValue) {
            draggableElement.style.top = rect.top - newY + 'px'
            prevY = event.clientY
          }
        }
        /**
         *
         */
        function mouseup () {
          window.removeEventListener('mousemove', mousemove)
          window.removeEventListener('mouseup', mouseup)
        }
      }
    }
  })
