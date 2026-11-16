import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

export function apiSuccess<T>(data: T, message?: string, statusCode = 200, meta?: ApiResponse["meta"]) {
  const payload: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    data,
    ...(meta ? { meta } : {}),
  };
  return NextResponse.json(payload, { status: statusCode });
}

export function apiError(message: string, statusCode = 500, errors?: unknown) {
  const payload: ApiResponse = {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
  };
  return NextResponse.json(payload, { status: statusCode });
}

export function handleApiError(error: unknown) {
  console.error("[API Error]:", error);

  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    return apiError("Validation failed", 400, formattedErrors);
  }

  if (error instanceof AppError) {
    return apiError(error.message, error.statusCode, error.details);
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (typeof error === "object" && error !== null && "code" in error && (error as { code: unknown }).code === 11000) {
    const keyPattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern;
    const field = keyPattern ? Object.keys(keyPattern)[0] : "field";
    return apiError(`A record with this ${field} already exists.`, 409);
  }

  // Generic fallback
  const message = error instanceof Error ? error.message : "Internal Server Error";
  return apiError(message, 500);
}

