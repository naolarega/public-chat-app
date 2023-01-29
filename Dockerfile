FROM python:3.10.6-slim

WORKDIR /usr/local/src/app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "main.py" ]