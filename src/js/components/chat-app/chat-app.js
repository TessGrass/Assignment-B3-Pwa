import { EmojiButton } from '@joeattardi/emoji-button'

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
    height: 520px;
}

.chatwindow {
  display:block;
  position: relative;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
    width: 400px;
    height: 445px;
    background: white;
    word-wrap: break-word;
    overflow-y: auto;  
}

.chattextarea {
    background: black;
    position: absolute;
    margin-bottom: 9px;
    margin-left: 8px;
    bottom: 0px;
    background: white;
    max-width: 280px;
    height: 50px;
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
    cursor: pointer;
}

  .giphywindow {
    float: right;
    display: block;
    position: fixed;
    bottom: 0;
    top: 45%;
    border-radius: 5px 0px 0px 5px;
    margin: 0px 0px 5px 115px;
    width: 260px;
    padding-top: 40px;
    min-height: 15px;
    max-height: 140px;
    background: #D8D8C0;    
}

  .giphywindow > img {
    flex-grow: 1;
    padding: 5px;
    max-height: 6vh;
    max-width: 6vw;
    cursor: pointer;
    flex-basis: 28%
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
    max-height: 10vh;
    width: 13vw;
    cursor: pointer;
    flex-basis: 28%
  }

  .inactive {
      display: none;
  }

  .recievechat {
    display: block;
    clear: both;
    background-color: #92C7A3;
    padding: 5px;
    margin-top: 8px;
    min-width: 30%;
    max-width: 50%;
    max-height: 100%;
    margin-bottom: 5px;
    margin-left: 0px;
    border-radius: 0px 5px 5px 0px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mychat {
    display: block;
    clear: both;
    float: right;
    background-color: #C0D8D8;
    padding: 5px;
    margin-top: 8px;
    min-width: 30%;
    max-width: 50%;
    max-height: 100%;
    margin-bottom: 5px;
    border-radius: 5px 0px 0px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mychat > img {
    width: 90%

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
    padding-top: 10px;
  }

  .usernamewrapper {
    display: flex;
    justify-content: center;
    flex-direction: column; 
    align-items: center;
    width: 400px;
    height: 480px;
  }

  .usernamebutton {
    width: 70px;
    height: 45px;
    margin-top: 10px;
  }

  .usernameinput {
    text-align: center;
  }

  .gifsearch {
    display: block;
    clear: both;
    position: absolute;
    top: 1px;
    margin-bottom: 5px;
    border: 0.5px solid #D8D8C0;
    border-radius: 5px;
    padding-left: 7px;
    width: 120px;
  }

  #emoji-trigger{
    float: right;
    margin-top: 16px;
    margin-right: 84px;
    font-size: 20px;
    width: 20px;
    height: 20px;
    border: none;
    cursor: pointer;
    background: #222222;
  }

  .emoji-picker {
    --emoji-per-row: 5 !important; 
  }

  .connect {
    font-size: 20px;
    padding-bottom: 10px;
    font-family: arial;
  }

  


</style>
<div class="usernamewrapper">
  <p class="connect">CONNECT TO CHAT</p>
    <input type="text" class="usernameinput" value="" placeholder=" Choose your nickname"></input>
    <button class="usernamebutton">Start chatting</button>
    </div>
  <div class="chatwrapper inactive">
      <div class="inputbackground">
         <form>
          <textarea class="chattextarea" name="message" rows="4" cols="50" maxlength="200"></textarea>
          <button id="emoji-trigger">🙂</button>
          <button class="giphy"></button>
          <button class="paperplane"></button>          
          </form>
      </div>
    <div class="chatwindow">
        <div class="giphywindow inactive">
              <input type="text" class="gifsearch" value="" placeholder="Search your gif here"></input>
        </div>
        <div class="emojiwindow"></div>
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
      this.gifSearchField = this.shadowRoot.querySelector('.gifsearch')
      this.chatTextArea = this.shadowRoot.querySelector('.chattextarea')
      this.gifWindow = this.shadowRoot.querySelector('.giphywindow')
      this.chatWindow = this.shadowRoot.querySelector('.chatwindow')
      this.chatWrapper = this.shadowRoot.querySelector('.chatwrapper')
      this.pElement = this.shadowRoot.querySelector('.timestamp')
      this.usernameWrapper = this.shadowRoot.querySelector('.usernamewrapper')
      this.usernameInput = this.shadowRoot.querySelector('.usernameinput')
      this.usernameButton = this.shadowRoot.querySelector('.usernamebutton')
      this.usernameInput.value = localStorage.getItem('chat_username')
      this.trigger = this.shadowRoot.querySelector('#emoji-trigger')
      this.emojiWindow = this.shadowRoot.querySelector('.emojiwindow')
      this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
      this.picker = new EmojiButton({ theme: 'dark' })

      this.usernameButton.addEventListener('click', (event) => {
        if (localStorage.getItem === 'chat_username') {
          this.username = localStorage.getItem('chat_username')
          this.usernameWrapper.style.display = 'none'
        } else {
          this.username = this.usernameInput.value
          localStorage.setItem('chat_username', this.username)
          this.usernameWrapper.style.display = 'none'
          this.chatWrapper.classList.toggle('inactive')
        }
        this.webSocketData()
        event.preventDefault()
      })

      this.sendMessageButton.addEventListener('click', (event) => {
        this.sendMessage(this.chatTextArea.value)
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
          this.sendMessage(this.chatTextArea.value)
        }
      })

      this.trigger.addEventListener('click', (event) => {
        event.preventDefault()
        this.picker.wrapper.style.zIndex = '1000'
        this.picker.togglePicker(this.chatTextArea)
      })

      this.picker.on('emoji', selection => {
        this.sendMessage(selection.emoji)
        console.log(selection.emoji)
      })

      /**
       * Checks for new Messages.
       *
       * @param {object} event - data from fetchData.
       */
      this.socket.onmessage = (event) => {
        console.log('this.socket rad 351')
        this.checkNewMessage(event)
        console.log('this.socket rad 354')
      }
    }

    /**
     * Server with data.
     */
    webSocketData () {
      try {
        // this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
        this.fetchData = {
          type: 'message',
          data: 'The message text is sent using the data property',
          username: this.username,
          channel: 'my, not so secret, channel',
          key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        }
        console.log(this.fetchData)
      } catch (error) {
        console.log('Oops, something went wrong')
      }
    }

    /**
     * Checks for new Messages, and what type of message that is received.
     *
     * @param {object} event - data from fetchData.
     */
    checkNewMessage (event) {
      try {
        const data = JSON.parse(event.data)
        console.log('checkNewMessage row 381')

        if (data.data) {
          this.recieveText = document.createElement('div')
          this.recieveText.style.width = '350px'
          this.pTime = document.createElement('p')
          const check = this.validURL(data.data)
          if (check) {
            this.gifImg = document.createElement('img') // Question: if, for example, a SVG with hidden script is sent an <img> tag will not allow the script to run.
            this.gifImg.src = data.data
            this.recieveText.classList.add('mychat')
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
            console.log('checkNewMessage 402')
            this.recieveText.append(data.username + ':' + data.data)
            this.pTime.textContent = today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes()
            this.recieveText.append(this.pTime)
          }
          this.chatWindow.appendChild(this.recieveText)
          this.chatWindow.scrollTop = this.chatWindow.scrollHeight
        }
      } catch (error) {
        console.log('Oops, something went wrong')
      }
    }

    /**
     * Checks for valid URL.
     *
     * @param {string} str - the parameter that is going to be checked.
     * @returns {boolean} - true or false.
     */
    // CODE CREDIT: https://www.codegrepper.com/code-examples/javascript/javascript+check+if+valid+url
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
     * Implementing the giphy API.
     */
    async getImages () {
      try {
        console.log('getImages 433')
        const imagesContainer = []
        const url = 'https://api.giphy.com/v1/gifs/search?q=' + this.gifSearchField.value + '&rating=g&limit=4&api_key=yQC3qMgBqPWBQDkjDQo7KkJqvY1GiFoH'
        const fetchedUrl = await fetch(url)
        const response = await fetchedUrl.json()
        console.log(response.data[0].images)
        const imagesArray = response.data
        this.gifWindow.innerHTML = ''
        for (let i = 0; i < imagesArray.length; i++) {
          imagesContainer[i] = document.createElement('img')
          imagesContainer[i].setAttribute('src', imagesArray[i].images.original.url)
          imagesContainer[i].addEventListener('click', (event) => {
            this.sendMessage(imagesContainer[i].src)
            this.gifWindow.classList.toggle('inactive')
          })
          this.gifWindow.appendChild(this.gifSearchField)
          this.gifWindow.appendChild(imagesContainer[i])
        }
      } catch (error) {
        console.log('Oops, something went wrong')
      }
    }

    /**
     * Sending a chat message.
     *
     * @param {string} data - data that will be sent.
     */
    sendMessage (data) {
      try {
        console.log('sendMessage 459')
        // const dataMessage = data
        this.fetchData.data = data
        console.log(this.fetchData.data)
        this.socket.send(JSON.stringify(this.fetchData))
        this.chatTextArea.value = ''
      } catch (error) {
        console.log('Oops, something went wrong')
      }
    }

    /**
     * Closes the socket connection.
     *
     */
    disconnectedCallback () {
      console.log('close')
      this.socket.close()
    }
  })
