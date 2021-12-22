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
    background: #222222;
    width: 400px;
    height: 600px;
}

.chatwindow {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
    width: 400px;
    height: 565px;
    background:white;
    word-wrap: break-word;
}

.chattextarea {
    background: black;
    position: absolute;
    margin-bottom: 8px;
    margin-left: 5px;
    bottom: 0px;
    background: white;
    max-width: 310px;
    height: 45px;
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

  .sendchat {
    background-color: green;
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
      this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

      this.fetchData = {
        type: 'message',
        data: 'The message text is sent using the data property',
        username: 'TessG',
        channel: 'my, not so secret, channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }

      this.sendMessageButton.addEventListener('click', (event) => {
        event.preventDefault()
      })

      this.showGifWindowButton = this.shadowRoot.querySelector('.giphy')
        .addEventListener('click', (event) => {
          event.preventDefault()
          this.gifWindow.classList.toggle('inactive')
        })

      this.gifSearchField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          this.getImages()
        }
      })

      this.chatTextArea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          const dataMessage = this.chatTextArea.value
          this.fetchData.data = dataMessage
          // console.log(this.fetchData)
          this.socket.send(JSON.stringify(this.fetchData))
          this.chatTextArea.value = ''
          event.preventDefault()
        }
      })

      this.socket.onmessage = (event) => {
        console.log('onmessage')
        this.checkNewMessage(event)
      }
    }

    checkNewMessage(event) {
      const data = JSON.parse(event.data)
      console.log(data.data)
      if (data.data) {
        console.log('checkNewMessage')
        this.pText = document.createElement('p')
        this.pText.classList.add('sendchat')
        console.log(this.pText)
        this.pText.append(data.data)
        this.chatWindow.appendChild(this.pText)
      }
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
