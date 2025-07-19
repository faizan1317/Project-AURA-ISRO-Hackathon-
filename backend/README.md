# Project AURA Backend

This is the FastAPI backend for Project AURA, developed for the ISRO Hackathon.

## Tech Stack

- FastAPI
- Python 3.x
- Uvicorn (ASGI Server)
- Pydantic

## Setup Instructions

### 1. Install Dependencies

Install all required packages:

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
ENVIRONMENT=development
```

### 3. Run the Server

Start the development server:

```bash
uvicorn main:app --reload
```

The server will be running at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- Swagger UI Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

## Available Endpoints

- `GET /`: Welcome message

## Development

### Project Structure

```
backend/
├── .env
├── .gitignore
├── main.py
├── requirements.txt
└── venv/
```
