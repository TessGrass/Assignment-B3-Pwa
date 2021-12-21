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
    background:green;
}

.chattextarea {
    background: black;
    position: absolute;
    margin-bottom: 12px;
    margin-left: 5px;
    bottom: 0px;
    background: yellow;
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

    .giphywindow {
        margin-left: 35px;
        margin-right: 1px;
        margin-top: 10px;
        display: flex;
      flex-wrap: wrap;
      flex-direction: row; 
        width: 270px;
    height: 250px;
    border: 2px solid red;
    }

    input {
        padding-left: 2px;
        padding-right: 20px;
        height: 25px;
    }

    img {
    flex-grow: 1;
    padding: 5px;
    max-height: 8vh;
    max-width: 28vw;
    cursor: pointer;
    flex-basis: 28%
  }

  .inactive {
      display: none;
  }

</style>

  <div class="chatwrapper">
      <div class="inputbackground">
         <form>
          <textarea class="chattextarea" name="message" rows="4" cols="50"></textarea>
          <button class="giphy"></button>
          <button class="paperplane"></button>
          </form>
      </div>
    <div class="chatwindow">
        <p></p>
        <div class="giphywindow inactive">
                 <input type="text" value="" placeholder="What gif are you looking for?"></input>
        </div>
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
      this.gifSearchField = this.shadowRoot.querySelector('input')
      this.chatTextArea = this.shadowRoot.querySelector('.chattextarea')
      this.gifWindow = this.shadowRoot.querySelector('.giphywindow')
      this.chatWindow = this.shadowRoot.querySelector('.chatwindow')
      this.chatwrapper = this.shadowRoot.querySelector('.chatwrapper')
      this.pText = this.shadowRoot.querySelector('p')
      this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

      this.fetchData = {
        type: 'message',
        data: 'The message text is sent using the data property',
        username: 'TessG',
        channel: 'my, not so secret, channel2',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }

      this.sendMessageButton.addEventListener('click', (event) => {
        event.preventDefault()
        console.log('knapp')
      })

      this.showGifWindowButton = this.shadowRoot.querySelector('.giphy')
        .addEventListener('click', (event) => {
          event.preventDefault()
          this.gifWindow.classList.toggle('inactive')

          console.log('knapp')
        })

      this.gifSearchField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          this.getImages()
        }
      })

      this.chatTextArea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            console.log(this.chatTextArea.value)
            const dataMessage = this.chatTextArea.value
            console.log(dataMessage)
            this.fetchData.data = dataMessage
            this.socket.send(JSON.stringify(this.fetchData))
            this.pText.textContent = dataMessage
          event.preventDefault()
        }
      })
    }

        async getImages() {
      const url = 'https://api.giphy.com/v1/gifs/search?q=' + this.gifSearchField.value + '&rating=g&limit=6&api_key=yQC3qMgBqPWBQDkjDQo7KkJqvY1GiFoH'
      const fetchedUrl = await fetch(url)
      const response = await fetchedUrl.json()
      console.log(response.data[0].images)
      const imagesArray = response.data
      const imagesContainer = []
      this.gifWindow.innerHTML = ''
      for (let i = 0; i < imagesArray.length; i++) {
        imagesContainer[i] = document.createElement('div')
        imagesContainer[i] = document.createElement('img')
        imagesContainer[i].setAttribute('src', imagesArray[i].images.original.url)
        console.log(imagesContainer[i])
        /* imagesContainer[i].addEventListener('click', (event) => {
          window.open(imagesContainer[i].links.html, '_blank')
        }) */
        this.gifWindow.appendChild(imagesContainer[i])
      }
    }
    /* async getImages() {
      const url = 'api.giphy.com/v1/gifs/search?q=' + this.gifSearchField.value + '&rating=g&'
      const fetchedUrl = await fetch(url, {
        headers: {
          Authorization: 'api_key=yQC3qMgBqPWBQDkjDQo7KkJqvY1GiFoH'
        }
      })
      const response = await fetchedUrl.json()
      console.log(response)
    } */
  })
