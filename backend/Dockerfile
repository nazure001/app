# Gunakan Python versi ringan
FROM python:3.9-slim

# Set folder kerja
WORKDIR /app

# Copy requirements dan install
COPY requirements.txt .
# Tips: Upgrade pip agar install lebih cepat
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy seluruh kode backend
COPY . .

# Hugging Face menggunakan port 7860
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]