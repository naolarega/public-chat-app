from uvicorn import run
from typing import List, Optional
from db import add_message, get_messages
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

app.mount(path="/client", app=StaticFiles(directory="client"), name="client")

websocket_connections: List[WebSocket] = [];

async def connect(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.append(websocket)

def disconnect(websocket: WebSocket):
    websocket_connections.remove(websocket)

async def send_broadcast(message: str, message_type: str = "regular", client_id: Optional[int] = None):
    data = {
        "message": message,
        "type": message_type
    }
    if client_id is not None:
        data["client_id"] = client_id
    for websocket_connection in websocket_connections:
        await websocket_connection.send_json(data)

@app.websocket("/ws/{client_id}")
async def ws(websocket: WebSocket, client_id: int):
    await connect(websocket)
    await send_broadcast(
        message=f"{client_id}",
        message_type="joined",
        client_id=client_id)
    await add_message({
        "client_id": client_id,
        "message_type": "joined",
        "message": str(client_id)
    })
    try:
        while True:
            data = await websocket.receive_json()
            await send_broadcast(
                message=data["message"],
                client_id=int(data["client_id"]))
            await add_message({
                "client_id": int(data["client_id"]),
                "message_type": "regular",
                "message": data["message"]
            })
    except WebSocketDisconnect:
        disconnect(websocket)
        await send_broadcast(message=f"{client_id}", message_type="left")
        await add_message({
            "client_id": client_id,
            "message_type": "left",
            "message": str(client_id)
        })

@app.get("/messages/all_messages")
async def all_messages():
    return await get_messages()

if __name__ == "__main__":
    run("main:app", host="0.0.0.0", port=8000, reload=True)