const messageList = document.querySelector('#chat-list-container');

export function addMessageToList(message, direction, type, clientId) {
    const messageDiv = document.createElement('div');
    const messageRibbonDiv = document.createElement('div');
    
    messageDiv.className = 'chat-message-container'
    messageRibbonDiv.className = 'chat-message-ribbon-container';
    if(direction === 'recieved') {
        messageRibbonDiv.className += ' chat-recieved';
    } else if(direction === 'sent') {
        messageRibbonDiv.className += ' chat-sent';
    }

    const messageSpan = document.createElement('span')
    messageSpan.className = "chat-message";
    if(type === 'regular') {
        messageSpan.innerHTML = message;
        messageRibbonDiv.className += ' chat-regular';
    } else if(type === 'joined') {
        messageSpan.innerHTML = `Client #${message} joined`;
        messageRibbonDiv.className += ' chat-joined';
    } else if(type === 'left') {
        messageSpan.innerHTML = `Client #${message} left`;
        messageRibbonDiv.className += ' chat-left';
    }

    messageRibbonDiv.appendChild(messageSpan);
    if(type === 'regular') {
        const timeSpan = document.createElement('span');
        timeSpan.className = "chat-time";
        const currentTime = new Date();
        timeSpan.innerHTML = `${currentTime.getUTCHours()}:${currentTime.getUTCMinutes()}`;
        messageRibbonDiv.appendChild(timeSpan);
    }

    if(type === 'regular') {
        const clientIdSpan = document.createElement('span');

        clientIdSpan.className = 'chat-clientid';
        clientIdSpan.innerHTML = clientId.toString()[0];
        clientIdSpan.title = clientId;
        if(direction === 'recieved') {
            messageDiv.appendChild(clientIdSpan);
            messageDiv.appendChild(messageRibbonDiv);
        } else if(direction === 'sent') {
            messageDiv.appendChild(messageRibbonDiv);
            messageDiv.appendChild(clientIdSpan);
        }
    } else {
        messageDiv.appendChild(messageRibbonDiv);
    }
    messageList.appendChild(messageDiv);
    messageList.scroll({
        top: messageList.scrollHeight,
        behavior: 'smooth'
    });
}