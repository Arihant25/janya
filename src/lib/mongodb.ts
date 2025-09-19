import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClient: MongoClient | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClient) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClient = client;
  }
  clientPromise = global._mongoClient.connect();
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db('janya');
}