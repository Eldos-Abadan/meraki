# Құрылыс кезеңі - React
FROM node:16 as frontend-builder
WORKDIR /app
COPY meraki-frontend/package*.json ./
RUN npm install
COPY meraki-frontend/ .
RUN npm run build

# Құрылыс кезеңі - Python
FROM python:3.9 as python-builder
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --user -r requirements.txt

# Финальный образ
FROM python:3.9-slim
WORKDIR /app

# Python әлеуеттерін көшіру
COPY --from=python-builder /root/.local /root/.local
COPY --from=frontend-builder /app/build /app/frontend/build

# Django кодтарын көшіру
COPY backend/ .

# Орта айнымалылары
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app

EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]