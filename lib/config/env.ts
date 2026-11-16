export const config = {
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/giftaura",
  jwtSecret: process.env.JWT_SECRET || "giftaura-default-development-jwt-secret-key-32-chars",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  whatsappPhone: process.env.WHATSAPP_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "918087142499",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  uploadDir: process.env.UPLOAD_DIR || "./public/uploads",
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
};

