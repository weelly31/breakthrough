import { MongoClient } from 'mongodb';

let client;
let clientPromise;

export default async function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment variables.');
  }

  const options = {};
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    return client.connect();
  }
}
