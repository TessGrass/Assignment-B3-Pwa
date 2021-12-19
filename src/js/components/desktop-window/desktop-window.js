
const template = document.createElement('template')
template.innerHTML = `
<style>
    #windowcontainer {
      display: inline-block;
      position: absolute;
      height: 130px;
      border-radius: 10px;
      margin: 0;  
    }

    #divheader {
      margin: 0;
      cursor: pointer;
      background-color: #92C7A3;
      text-align: right;
      max-width: 900px;
      height: 27px;
      z-index: 2000;
    }
    
    #divcontent {
      display: inline-block;
      background-color: white;
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
<div id="windowcontainer">
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
      const windowContainer = this.shadowRoot.querySelector('#windowcontainer')
      this.divContent = this.shadowRoot.querySelector('#divcontent')
      this.header = this.shadowRoot.querySelector('#divheader')
      this.button = this.shadowRoot.querySelector('button')

      this.button.addEventListener('click', (event) => {
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('closewindow', {
          bubbles: true
        }))
      })
      this.header.addEventListener('mousedown', mousedown)
      // this.divContent.style.pointerEvents = 'none'

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
          const widthValue = 300
          const heightValue = 340

          const rect = windowContainer.getBoundingClientRect()
          // checks where the object is positioned in the viewport (domRect)
          if (rect.x < 0) { // found in domRect, x = 0 is the furthers to the left.
            rect.x = 0
            prevX = 0
          } else if (rect.x + widthValue > window.innerWidth) {
            // if X and widthValue is greater than Window.innerWidth the x-value is reduced with widthValue
            rect.x = window.innerWidth - widthValue
            prevX = window.innerWidth - widthValue
          }
          if (rect.x >= 0 && rect.x <= window.innerWidth - widthValue) { // if rect x is smaller than 0 AND the innerwith - widthValue, the window can't be moved further outside.
            windowContainer.style.left = rect.left - newX + 'px'
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
            windowContainer.style.top = rect.top - newY + 'px'
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

    setZindexTo(newZindex) {
      this.shadowRoot.querySelector('#windowcontainer').style.zIndex = newZindex
    }

    getZindex() {
      return this.shadowRoot.querySelector('#windowcontainer').style.zIndex
    }
    /* focus(setFocus) {
      setFocus ? this.shadowRoot.querySelector('#divwindow').classList.add('focus') : this.shadowRoot.querySelector('#divwindow').classList.remove('focus')
    } */
  })
