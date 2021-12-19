const template = document.createElement('template')
template.innerHTML = `
<style>
 * {
  margin: 0;
  padding: 0;
 }
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
      background: white;
      border: 0.5 solid #222222;
      flex: 25%;
  }
  
  .input {
      margin-top: 50px;
      z-index: 500;
  }

  header {
    background: white;
      margin-top: 10px;
  }

  img {
    padding: 10px;
    max-height: 20vh;
    max-width: 20vw;
  }

  h1 {
    margin: 0px;
    padding: 0px;
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
      const url = 'https://api.unsplash.com/search/photos/?query=' + this.input.value + '&orientation=landscape'
      const fetchedUrl = await fetch(url, {
        headers: {
          Authorization: 'Client-ID iczfs_vxPOCtlCw-rifNqkkcu5hxrangGv7GVR3br3s'
        }
      })
      const response = await fetchedUrl.json()
      console.log(response)
      const images = response.results
      const imagesArray = images.slice(0, 6)
      const imagesContainer = []
      this.grid.innerHTML = ''
      for (let i = 0; i < images.length; i++) {
        imagesContainer[i] = document.createElement('div')
        imagesContainer[i] = document.createElement('img')
        imagesContainer[i].src = imagesArray[i].urls.small
        console.log(imagesArray[i].urls.small)
        imagesContainer[i].addEventListener('click', (event) => {
          console.log('här')
          console.log(imagesArray[i].links)
          window.open(imagesArray[i].links.html, '_blank')
        })
        this.grid.appendChild(imagesContainer[i])
      }
    }
  })
