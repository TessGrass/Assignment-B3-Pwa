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
  display:block;
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
    margin-left: 8px;
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
    display: flex;
    flex-wrap: wrap;
    flex-direction: row; 
    border-radius: 10px;
    margin: 10px 0px 5px 95px;
    width: 270px;
    height: 250px;
    border: 1px solid black;
    background: #C8C8C8;
    top: 100vh;
}

    input {
    margin-top: 5px;
    margin-left: 5px;
    border-radius: 5px;
    padding-right: 15px;
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
    background-color: #92C7A3;
    padding: 5px;
    margin-top: 8px;
    min-width: 50%;
    max-width: 55%;
    max-height: 100%;
    margin-bottom: 5px;
    margin-left: 0px;
    border-radius: 0px 5px 5px 0px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mychat {
    float: right;
    background-color: #C0D8D8;
    padding: 5px;
    margin-top: 8px;
    min-width: 50%;
    max-width: 55%;
    max-height: 100%;
    margin-bottom: 5px;
    border-radius: 5px 0px 0px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .timerecievechat {
    float: right;
    text-align: center;
    margin-left: 120px;
    width: 32px;
    height: 12px;
    background: #92C7A3;
    font-size: 10px;
    padding-top: 10px;
  }
  .timemychat {
    text-align: center;
    margin-left: 0px;
    width: 32px;
    height: 12px;
    background: #C0D8D8;
    font-size: 10px;
  }

  .usernamewrapper {
    display: flex;
    justify-content: center;
    flex-direction: column; 
    align-items: center;
    width: 250px;
    height: 250px;
    border: 2px solid red;
  }

  .usernamebutton {
    width: 70px;
    height: 45px;
    margin-top: 10px;
  }

  .usernameinput {
    text-align: center;
  }



</style>
<div class="usernamewrapper">
    <input type="text" class="usernameinput" value="" placeholder="Choose your nickname"></input>
    <button class="usernamebutton">Start chatting</button>
    </div>
  <div class="chatwrapper inactive">
      <div class="inputbackground">
         <form>
          <textarea class="chattextarea" name="message" rows="4" cols="50" maxlength="200"></textarea>
          <button class="giphy"></button>
          <button class="paperplane"></button>
          </form>
      </div>
    <div class="chatwindow">
        <div class="giphywindow inactive">
              <input type="text" value="" placeholder="Search your gif here"></input>
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
      this.chatWrapper = this.shadowRoot.querySelector('.chatwrapper')
      this.pElement = this.shadowRoot.querySelector('.timestamp')
      this.usernameWrapper = this.shadowRoot.querySelector('.usernamewrapper')
      this.usernameinput = this.shadowRoot.querySelector('.usernameinput')
      this.usernamebutton = this.shadowRoot.querySelector('.usernamebutton')
      this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
      this.username = ''
      

      this.usernamebutton.addEventListener('click', (event) => {
        this.username = this.usernameinput.value
        this.usernameWrapper.style.display = 'none'
        this.chatWrapper.classList.toggle('inactive')
        this.fetchData()
        event.preventDefault()
      })

      this.sendMessageButton.addEventListener('click', (event) => {
        this.sendMessage()
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
          this.sendMessage()
        }
      })

      /**
       * @param event
       */
       this.socket.onmessage = (event) => {
        this.checkNewMessage(event)
      }
    }

    fetchData() {
      this.fetchData = {
        type: 'message',
        data: 'The message text is sent using the data property',
        username: this.username,
        channel: 'my, not so secret, channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
    }

    /**
     * @param event
     */
    checkNewMessage (event) {
      this.recieveText = document.createElement('div')
      this.recieveText.style.width = '350px'
      this.pTime = document.createElement('p')
      const data = JSON.parse(event.data)
      if (data.data) {
        const check = this.validURL(data.data)
        if (check) {
          this.gifImg = document.createElement('img')
          this.gifImg.src = data.data
          this.recieveText.append(this.gifImg)
        } else {
          if (data.username === this.username) {
            this.recieveText.classList.add('mychat')
            this.pTime.classList.add('timemychat')
          } else {
            this.recieveText.classList.add('recievechat')
            this.pTime.classList.add('timerecievechat')
          }
          const today = new Date()
          this.recieveText.append(data.username + ':' + data.data)
          this.pTime.textContent = today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes()
          this.recieveText.append(this.pTime)
        }
        this.chatWindow.appendChild(this.recieveText)
      }
    }

    /**
     * Checks for valid URL.
     *
     * @param {string} str - the parameter that is going to be checked.
      * @returns - true or false.
     */
    validURL (str) {
      const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
      this.check = !!pattern.test(str)
      return !!pattern.test(str)
    }

    /**
     * Implementing the gif API.
     */
    async getImages () {
      const imagesContainer = []
      const url = 'https://api.giphy.com/v1/gifs/search?q=' + this.gifSearchField.value + '&rating=g&limit=6&api_key=yQC3qMgBqPWBQDkjDQo7KkJqvY1GiFoH'
      const fetchedUrl = await fetch(url)
      const response = await fetchedUrl.json()
      console.log(response.data[0].images)
      const imagesArray = response.data
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
          this.gifWindow.classList.toggle('inactive')
        })
        this.gifWindow.appendChild(imagesContainer[i])
      }
    }

    sendMessage() {
      const dataMessage = this.chatTextArea.value
          /* this.pSendText = document.createElement('p')
        this.pSendText.classList.add('sendchat')
        this.pSendText.append(dataMessage)
        this.chatWindow.appendChild(this.pSendText) */
          this.fetchData.data = dataMessage
          this.socket.send(JSON.stringify(this.fetchData))
          this.chatTextArea.value = ''
    }
  })
