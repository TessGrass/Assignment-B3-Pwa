const template = document.createElement('template')
template.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
}
    
.chatwrapper {
    display: flex;
    justify-content: center;
    position: relative;
    border: 2px solid black;
    background: #222222;
    width: 400px;
    height: 400px;
}

.chatwindow {
    margin-top: 25px;
    width: 400px;
    height: 365px;
    background: white;
}

.chatinput {
    background: black;
    position: absolute;
    margin-bottom: 12px;
    margin-left: 5px;
    bottom: 0px;
    background: white;
    max-width: 310px;
    height: 38px;
    border: 1px solid #222222;
}

.inputbackground {
    position: absolute;
    bottom: 0px;
    width: 400px;
    height: 65px;
    background: #222222;    
}

  .paperplane {
    right: 0;
    margin-bottom: 12px;
    margin-right: 5px;
    position: absolute;
    bottom: 0px;
    width: 40px;
    height: 40px;
    border: none;
    background-image: url('js/components/chat-app/lib/paper-plane-send.svg');
    background-size: cover;
    cursor: pointer;      
}
    .giphy {
        right: 0;
    margin-bottom: 19px;
    margin-right: 45px;
    position: absolute;
    bottom: 0px;
    width: 30px;
    height: 30px;
    border: none;
    background-image: url('js/components/chat-app/lib/giphylogo.svg');
    background-size: 25px 25px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    overflow: visible;
    }

    .giphysearchwindow {
        right: 0;
        width: 250px;
    height: 250px;
    border: 2px solid red;
    z-index: 50;
    }

    .gifsearchfield {
        padding-left: 2px;
        padding-right: 20px;
    }




</style>

  <div class="chatwrapper">
      <div class="inputbackground">
         <form>
          <textarea class="chatinput" name="message" rows="4" cols="50"></textarea>
          <button class="giphy"></button>
          <button class="paperplane"></button>
          </form>
      </div>
    <div class="chatwindow">
    <div class="giphysearchwindow"><input class="gifsearchfield" type="text" value="" placeholder="What gif are you looking for?"></div>
</div>
  </div>
`
customElements.define('chat-app',
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
        this.sendMessageButton = this.shadowRoot.querySelector('.paperplane')
        this.showGifWindowButton = this.shadowRoot.querySelector('.giphy')
        this.gifSearchField = this.shadowRoot.querySelector('.gifsearchfield')
        this.chatInputField = this.shadowRoot.querySelector('.chatinput')

      this.sendMessageButton.addEventListener('click', (event) => {
        event.preventDefault()
        console.log('knapp')
      })

      this.showGifWindowButton = this.shadowRoot.querySelector('.giphy')
        .addEventListener('click', (event) => {
          event.preventDefault()
          console.log('knapp')
        })

      this.gifSearchField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          console.log('gifsearchField')
        }
      })

      this.chatInputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          console.log('chatinputfield')
        }
      })
    }

    async getImages() {
        const url = 'api.giphy.com/v1/gifs/search?q=' + this.input.value + '&rating=g&api_key=yQC3qMgBqPWBQDkjDQo7KkJqvY1GiFoH'
        const fetchedUrl = await fetch(url, {
          headers: {
            Authorization: 'Client-ID iczfs_vxPOCtlCw-rifNqkkcu5hxrangGv7GVR3br3s'
          }
        })
        const response = await fetchedUrl.json()
      }
  })
