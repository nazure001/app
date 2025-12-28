# Gunakan image Python ringan
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements dan install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh kode backend
COPY . .

# Hugging Face Spaces secara default menggunakan port 7860
# Perintah untuk menyalakan server
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "7860"]