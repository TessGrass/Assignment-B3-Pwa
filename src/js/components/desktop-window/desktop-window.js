const template = document.createElement('template')
template.innerHTML = `
<style>
    #divwindow {
        position: absolute;
        width: 200px;
        height: 200px;
        background-color: red;
    }
    #divheader {
        cursor: move;
        background-color: green;
        width: 200px;
        height: 20px;
    }
</style>
<div id="divwindow">
<div id="divheader">Click here to move</div>
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

      const el = this.shadowRoot.querySelector('#divwindow')

      el.addEventListener('mousedown', mousedown)
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

          const rect = el.getBoundingClientRect()

          el.style.left = rect.left - newX + 'px'
          el.style.top = rect.top - newY + 'px'

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
