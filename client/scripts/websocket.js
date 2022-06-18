import { addMessageToList } from "./dom.js";

export default async function runWebsocketClient() {
    let clientId = 0;
    if(localStorage.getItem('clientId')) {
        clientId = localStorage.getItem('clientId');
    }
    else {
        clientId = Math.floor(Math.random() * 10000);
        localStorage.setItem('clientId', clientId);
    }
    const chatInputField = document.querySelector('#chat-input');
    const chatSendButton = document.querySelector('#chat-send');
    const websocket = new WebSocket(`ws://${location.host}/ws/${clientId}`);
    websocket.addEventListener('open', async () => {
        await populateWithMessages(clientId);
        chatSendButton.addEventListener('click', () => {
            const message = chatInputField.value;
            websocket.send(JSON.stringify({ "client_id": clientId, "message": message }));
            addMessageToList(message, 'sent', 'regular', clientId);
        });
    });
    websocket.addEventListener('message', ev => {
        const data = JSON.parse(ev.data)
        if(data.client_id != clientId) {
            addMessageToList(data.message, 'recieved', data.type, data.client_id);
        }
    });
}

async function populateWithMessages(clientId) {
    try {
        const messageResponce = await fetch(`${location.origin}/messages/all_messages`);
        const messages = await messageResponce.json();
        for(const message of messages) {
            addMessageToList(
                message.message,
                message.client_id != clientId ? 'recieved' : 'sent',
                message.message_type,
                message.client_id);
        }
    }
    catch(e) {
        console.error('unable to fetch messages');
    }
}