const template = document.createElement('template')
template.innerHTML = `
<style>
  .container {
      display: flex;
      flex-wrap: wrap;
    max-width: 900px;
    max-height: 900px;
  }

  .grid {
      width: 600px;
      max-height: 900px;
      order: 3;
      flex-grow: 4;
      background: yellow;
      flex: 33.33%;
  }
  
  .input {
      margin-top: 50px;
      z-index: 500;
  }

  header {
      margin-top: 50px;
  }

  img {
    padding: 10px;
    max-height: 20vh;
    max-width: 20vw;
  }

</style>
<header>
    <h1>IMAGE SEARCH</h1>
    <form>
        <input type="text" value="" placeholder="Search..."><button>Search</button>
  </form>
</header>
<div class="container">
    <div class="grid">
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
      this.grid = this.shadowRoot.querySelector('.grid')
      this.input = this.shadowRoot.querySelector('input')
      this.searchButton = this.shadowRoot.querySelector('button')
      this.searchButton.addEventListener('click', (event) => {
        event.preventDefault()
        console.log(this.input.value)
        this.getImages()
      })
    }

    async getImages() {
      const url = 'https://api.unsplash.com/search/photos/?query=' + this.input.value + '&orientation=landscape&per_page=9'
      const fetchedUrl = await fetch(url, {
        headers: {
          Authorization: 'Client-ID iczfs_vxPOCtlCw-rifNqkkcu5hxrangGv7GVR3br3s'
        }
      })
      const response = await fetchedUrl.json()
      console.log(response)
      const images = response.results
      const imagesArray = images.slice(0, 9)
      const imagesContainer = []
      this.grid.innerHTML = ''
      for (let i = 0; i < images.length; i++) {
        imagesContainer[i] = document.createElement('div')
        imagesContainer[i] = document.createElement('img')
        imagesContainer[i].src = imagesArray[i].urls.small
        imagesContainer[i].addEventListener('click', (event) => {
          console.log('här')
          console.log(imagesArray[i].links)
          window.open(imagesArray[i].links.html, '_blank')
        })
        this.grid.appendChild(imagesContainer[i])
      }
    }
  })
