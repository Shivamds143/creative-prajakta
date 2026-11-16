import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { ValidationError } from "@/lib/api/errors";
import { config } from "@/lib/config/env";

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export class UploadService {
  private static allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  static async uploadImage(file: File, folder = "products"): Promise<UploadResult> {
    // 1. Validate file exists
    if (!file) {
      throw new ValidationError("No file provided");
    }

    // 2. Validate MIME type
    if (!this.allowedMimeTypes.includes(file.type)) {
      throw new ValidationError(
        `Invalid file format: ${file.type}. Allowed formats: JPG, PNG, WEBP, GIF, SVG`
      );
    }

    // 3. Validate file size
    const maxBytes = config.maxFileSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new ValidationError(
        `File size exceeds maximum allowed limit of ${config.maxFileSizeMb}MB`
      );
    }

    // 4. Generate unique filename
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`;
    const uniqueId = crypto.randomBytes(12).toString("hex");
    const safeBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 20);
    const filename = `${safeBaseName}-${uniqueId}${ext}`;

    // 5. Ensure directory exists
    const targetDir = path.resolve(process.cwd(), config.uploadDir, folder);
    await fs.mkdir(targetDir, { recursive: true });

    // 6. Write file buffer to destination
    const filePath = path.join(targetDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;

    return {
      url: publicUrl,
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    };
  }
}

