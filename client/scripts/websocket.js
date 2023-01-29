import { addMessageToList } from "./dom.js";


export default class ChatClient {
    /**
     * @type {number}
     */
    #clientID;
    /**
     * @type {HTMLInputElement}
     */
    #chatInputField;
    /**
     * @type {HTMLButtonElement}
     */
    #chatSendButton;
    /**
     * @type {WebSocket}
     */
    #websocket;
    
    /**
     * A chat client management class. 
     */
    constructor() {
        this.#setClientId();
        this.#chatInputField = document.querySelector('#chat-input');
        this.#chatSendButton  = document.querySelector('#chat-send');
        this.#websocket = new WebSocket(`ws://${location.host}/ws/${this.#clientID}`);
    }

    /**
     * Start the websocket listener.
     */
    async runWebsocketClient() {
        this.#websocket.addEventListener('open', async () => {
            await this.#populateWithMessages();
            this.#chatSendButton.addEventListener('click', () => this.#sendMessage());
            window.addEventListener('keypress', ev => {
                if(ev.ctrlKey && ev.key === 'Enter') {
                    this.#sendMessage();
                }
            });
        });
        this.#websocket.addEventListener('message', ev => {
            const data = JSON.parse(ev.data);
            if(data.client_id !== this.#clientID) {
                addMessageToList(data.message, 'recieved', data.type, data.client_id);
            }
        });
    }

    /**
     * Sets the client id.
     */
    #setClientId() {
        this.#clientID = 0;
        if(localStorage.getItem('clientId')) {
            this.#clientID = Number(localStorage.getItem('clientId'));
        } else {
            this.#clientID = Math.floor(Math.random() * 10000);
            localStorage.setItem('clientId', this.#clientID);
        }
    }

    /**
     * Send the message to the rest of the clients.
     */
    #sendMessage() {
        const message = this.#chatInputField.value;
        this.#chatInputField.value = null;
        this.#websocket.send(JSON.stringify({ "client_id": this.#clientID, "message": message }));
        addMessageToList(message, 'sent', 'regular', this.#clientID);
    }

    /**
     * Load previouslly communicated messages.
     */
    async #populateWithMessages() {
        try {
            const messageResponce = await fetch(`${location.origin}/messages/all_messages`);
            const messages = await messageResponce.json();
            for(const message of messages) {
                addMessageToList(
                    message.message,
                    message.client_id !== this.#clientID ? 'recieved' : 'sent',
                    message.message_type,
                    message.client_id);
            }
        } catch(e) {
            console.error('unable to fetch messages');
        }
    }   
}