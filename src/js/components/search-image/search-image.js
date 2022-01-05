const template = document.createElement('template')
template.innerHTML = `
<style>
 * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
 }

  .container {
    display: flex;
    flex-wrap: wrap;
    max-width: 900px;
    min-height: 400px;
    max-height: 900px;
  }

  .grid {   
    display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: stretch; 
      width: 600px;
      max-height: 600px;
      background: #F5F5F5;
      border: 0.5 solid #222222;
      padding-left: 10px;
  }

  input {
      background: white;
      vertical-align: middle;
      padding-left: 10px;
      min-width: 50%;
        height: 34px;
      border-radius: 5px 0 0 5px;
      border: 2px solid #222222;
      z-index: 10;
  }

  button {
    margin: -5px;
    width: 34px;
    height: 34px;
    border: none;
    background-image: url('js/components/search-image/lib/searchwhite.svg');
    background-size: cover;
    cursor: pointer;
    vertical-align: middle;
  }

  header {
    background: white;
    margin-top: 15px;
    margin-left: 15px;
    margin-bottom: 25px;
  }

  img {
    flex-grow: 1;
    padding: 5px;
    max-height: 14vh;
    max-width: 10vw;
    cursor: pointer;
    flex-basis: 18%
  }

  img:hover {
    margin: 0px;
    border: 1px solid black;    
  }

  h1 {
    font-family: helvetica;
    font-size: 22px;
    margin: 0px;
    padding: 0px;
  }

</style>
<header>
    <h1>IMAGE FINDER</h1>
    <form>
        <input type="text" value="" placeholder="What image are you looking for?">
        <button></button>
  </form>

</header>
<div class="container">
    <div class="grid">
</div>
`
customElements.define('search-image',
  /**
   * Creates a search image component.
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
        this.getImages()
      })
    }

    /**
     * Get images from Giphy api and append it to the div this.grid.
     */
    async getImages () {
      try {
        const url = 'https://api.unsplash.com/search/photos/?query=' + this.input.value + '&orientation=landscape'
        const fetchedUrl = await fetch(url, {
          headers: {
            Authorization: 'Client-ID iczfs_vxPOCtlCw-rifNqkkcu5hxrangGv7GVR3br3s'
          }
        })
        const response = await fetchedUrl.json()
        const images = response.results
        const imagesArray = images.slice(0, 9)
        const imagesContainer = []
        this.grid.innerHTML = ''
        for (let i = 0; i < imagesArray.length; i++) {
          imagesContainer[i] = document.createElement('div')
          imagesContainer[i] = document.createElement('img')
          imagesContainer[i].src = imagesArray[i].urls.small
          imagesContainer[i].setAttribute('title', 'Proceed to Unsplash.com')
          imagesContainer[i].addEventListener('click', (event) => {
            window.open(imagesArray[i].links.html, '_blank')
          })
          this.grid.appendChild(imagesContainer[i])
        }
      } catch (error) {
        console.log('Oops, something went wrong')
      }
    }
  })
