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
    margin-bottom: 13px;
    margin-left: 5px;
    bottom: 0px;
    background: white;
    max-width: 360px;
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

  button {
    right: 0;
    margin-bottom: 13px;
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
</style>

  <div class="chatwrapper">
      <div class="inputbackground">
         <form>
          <textarea class="chatinput" name="message" rows="4" cols="50"></textarea>
          <button></button>
          </form>
      </div>
    <div class="chatwindow">
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
        this.sendMessageButton = this.shadowRoot.querySelector('button')

    }
  })
