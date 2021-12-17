const template = document.createElement('template')
template.innerHTML = `
<style>
  .container {
      display: flex;
      flex-wrap: nowrap;
    width: 800px;
    height: 500px;
    background: red;
  }

  .grid {
      width: 300px;
      height: 300px;
      background: blue;
  }
  
  .input {
      margin-top: 50px;
  }

  header {
      margin-top: 50px;
  }

</style>
<header>
    <form>
        <input type = "text" id="input" placeholder="Search..."></input>
    </form>
</header>
<div class="container">
     <div class="grid"></div>
</div>
`
customElements.define('search-image',
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
      this.gameWrapper = this.shadowRoot.querySelector('#gamewrapper')
      this.input = this.shadowRoot.querySelector('input')

      this.input.addEventListener('keydown', (event) => {
        event.preventDefault()
        if (event.key === 'Enter') {
          console.log(this.input.value)
          this.getImages()
        }
      })
    }

    async getImages() {
      const url = 'https://api.unsplash.com/search/photos/?query=' + this.input.value + '&per_page9&client_id=iczfs_vxPOCtlCw-rifNqkkcu5hxrangGv7GVR3br3s'

    const fetchedUrl = await fetch(url)
        const response = await fetchedUrl.json()
        console.log(response.results)
    }
  })
