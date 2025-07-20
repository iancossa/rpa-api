# Use lightweight Python base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the source code
COPY . .

# Set environment variables
ENV PORT=5000

# Expose internal port
EXPOSE 5000

# Run the main Python file
CMD ["python", "main.py"]
