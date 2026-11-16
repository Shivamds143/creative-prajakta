import { NextResponse } from "next/server";
import { connectToDatabase, isDbConnected } from "@/lib/db/mongoose";
import { apiSuccess, handleApiError } from "@/lib/api/response";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let dbStatus = "disconnected";
    let collections: string[] = [];

    try {
      await connectToDatabase();
      dbStatus = isDbConnected() ? "connected" : "connecting";

      if (mongoose.connection.db) {
        const cols = await mongoose.connection.db.listCollections().toArray();
        collections = cols.map((c) => c.name);
      }
    } catch (dbErr) {
      dbStatus = `error: ${dbErr instanceof Error ? dbErr.message : "failed to connect"}`;
    }

    return apiSuccess({
      status: "healthy",
      service: "Creative Prajakta E-Commerce Backend",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState,
        collections,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

