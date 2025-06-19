import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import dotenv from 'dotenv';

dotenv.config();

const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    console.log(`Job:`, job.data);
    const data = JSON.parse(job.data);
    /*
    Path: data.path
    read the pdf from path,
    chunk the pdf,
    call the openai embedding model for every chunk,
    store the chunk in qdrant db
    */

    // Load the PDF
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    const apiKey = process.env.OPENAI_API_KEY;

    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      apiKey: apiKey,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL || 'http://localhost:6333',
        collectionName: 'langchainjs-testing',
      }
    );
    await vectorStore.addDocuments(docs);
    console.log(`All docs are added to vector store`);
  },
  {
    concurrency: 100,
    connection: {
      host: process.env.VALKEY_HOST || 'localhost',
      port: process.env.VALKEY_PORT || '6379',
    },
  }
);