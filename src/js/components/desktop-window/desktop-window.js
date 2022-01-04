
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
      z-index: 2;
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
   * Creates a desktop window component.
   */
  class extends HTMLElement {
  /**
   * Creates a instance of the current type.
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
       * Sets the coordinates of a mousedown event.
       *
       * @param {object} event - mousedown event.
       */
      function mousedown (event) {
        addEventListener('mousemove', mousemove)
        addEventListener('mouseup', mouseup)

        let prevX = event.clientX // where the mouse is positioned when clicked
        let prevY = event.clientY

        /**
         * Makes a window draggable.
         *
         * @param {object} event - mousemove event.
         */
        // DRAGGABLE WINDOW CODE CREDIT (partial): https://www.youtube.com/watch?v=NyZSIhzz5Do
        function mousemove (event) {
          const newX = prevX - event.clientX // difference between old position and new position
          const newY = prevY - event.clientY
          const widthValue = 380
          const heightValue = 450

          const rect = windowContainer.getBoundingClientRect()// checks where the object is positioned in the viewport (domRect)
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
         * Removes eventListener when the event mousemove and mouseup is triggered.
         */
        function mouseup () {
          window.removeEventListener('mousemove', mousemove)
          window.removeEventListener('mouseup', mouseup)
        }
      }
    }

    /**
     * Updates the zIndex to the value from parameter.
     *
     * @param {number} newZindex - Gets the highest z-index from getHighestZindex().
     */
    setZindexTo (newZindex) {
      this.shadowRoot.querySelector('#windowcontainer').style.zIndex = newZindex
    }

    /**
     * Gets the z-index from a window component.
     *
     * @returns {number} - returns the z-index on the window component.
     */
    getZindex () { // from this.getHighestZindex() method.
      this.number = this.shadowRoot.querySelector('#windowcontainer').style.zIndex
      this.stringToNumber = Number(this.number)
      return this.shadowRoot.querySelector('#windowcontainer').style.zIndex
    }
  })
