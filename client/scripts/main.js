import ChatClient from "./websocket.js";

(async function main() {
    const chatClient = new ChatClient();

    await chatClient.runWebsocketClient();
})();