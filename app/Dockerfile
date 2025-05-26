FROM python:3.10
WORKDIR /app
COPY index.py /app/
COPY requirements.txt /app/
COPY ./data/repositories.csv /app
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python3", "index.py"]
