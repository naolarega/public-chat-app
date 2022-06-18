FROM python:3.10.4-slim

WORKDIR /home/chat-service/app

ADD requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "main.py" ]