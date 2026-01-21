FROM python

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN pip install --upgrade flask werkzeug

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]


