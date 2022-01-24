const template = document.createElement('template')
template.innerHTML = `
<style>
  form {
    width: 65px;
    height: 30px;
    background: blue;
  }
</style>
<form>
<input type="radio" id="radio" name="radio">
<label for="radio"></label>
</form>
`
customElements.define('custom-buttom',
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
      this.button = this.shadowRoot.querySelector('input')

      this.addEventListener('click', (event) => {
      })
    }
  })
