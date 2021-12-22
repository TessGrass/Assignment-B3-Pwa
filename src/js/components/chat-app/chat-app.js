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
    height: 525px;
    background:white;
    word-wrap: break-word;
    overflow-y: auto;
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

  .recievechat {
    background-color: green;
    padding: 10px;
    margin-top: 10px;
    max-width: 40%;
    max-height: 100%;
    border-radius: 0px 5px 5px 0px;
  }

  .sendchat {
    background-color: aqua;
    padding: 10px;
    margin-top: 10px;
    margin-left: 200px;
    max-width: 100%;
    max-height: 100%;
    border-radius: 5px 0px 0px 5px;
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
          /* this.pSendText = document.createElement('p')
        this.pSendText.classList.add('sendchat')
        this.pSendText.append(dataMessage)
        this.chatWindow.appendChild(this.pSendText) */
          this.fetchData.data = dataMessage
          this.socket.send(JSON.stringify(this.fetchData))
          this.chatTextArea.value = ''
          event.preventDefault()
        }
      })

      this.socket.onmessage = (event) => {
        // console.log(event)
        this.checkNewMessage(event)
      }
    }

    checkNewMessage(event) {
      this.pRecieveText = document.createElement('p')
      const data = JSON.parse(event.data)
      console.log(data.data)
      if (data.data) {
       const check = this.validURL(data.data)
        if (check === true) {
          this.gifImg = document.createElement('img')
          this.gifImg.src = data.data
          console.log(this.gifImg.src)
          this.pRecieveText.append(this.gifImg)
        } else {
          this.pRecieveText.classList.add('recievechat')
          this.pRecieveText.append(data.username + ':' + data.data)
        }
        this.chatWindow.appendChild(this.pRecieveText)
      }
    }
    
    /**
     * 
     * @param {*} str 
     * @returns 
     */
    validURL(str) {
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i') // fragment locator
        this.check = !!pattern.test(str)
      return !!pattern.test(str)
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
        console.log(imagesContainer[i].src)
        imagesContainer[i].addEventListener('click', (event) => {
          this.fetchData.data = imagesContainer[i].src
          console.log(this.fetchData.data)
          this.socket.send(JSON.stringify(this.fetchData))
        
          // this.socket.send(JSON.stringify(imagesContainer[i].src))
          // window.open(imagesContainer[i].url, '_blank')
        })
        this.gifWindow.appendChild(imagesContainer[i])
      }
    }
  })
