import { MongoClient, Db } from "mongodb";
import { config } from "@/lib/config/env";

const uri = config.mongodbUri;
const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };

export function getClient(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI not set");
  return (g._mongo ??= new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }).connect());
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db();
}
