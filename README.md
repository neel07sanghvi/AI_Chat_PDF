# PDF RAG Application

A simple application for uploading PDFs and querying them using RAG (Retrieval-Augmented Generation).

## Project Structure

- **client**: Next.js frontend application
- **server**: Express backend with PDF processing capabilities

## Prerequisites

- Node.js v20+
- Docker and Docker Compose
- OpenAI API key
- Clerk API keys (for authentication)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd pdf-rag-code
```

### 2. Set up environment variables

#### For the server:

Create a `.env.docker` file in the `server` directory:

```
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://qdrant:6333
VALKEY_HOST=valkey
VALKEY_PORT=6379
```

#### For the client:

Create a `.env.docker` file in the `client` directory:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start the server (Backend)

```bash
cd server
docker-compose up -d
```

This will start:
- Express server on port 8000
- Worker for processing PDFs
- Qdrant vector database
- Valkey (Redis) for queue management

### 4. Start the client (Frontend)

```bash
cd client
docker-compose up -d
```

This will start the Next.js application on port 3000.

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Upload a PDF file using the upload component
3. Wait for the PDF to be processed
4. Use the chat interface to ask questions about the PDF content

## Troubleshooting

- If PDFs aren't being processed correctly, check the worker logs: `docker logs worker`
- For frontend issues, check the client logs: `docker logs client`
- For backend issues, check the server logs: `docker logs server`