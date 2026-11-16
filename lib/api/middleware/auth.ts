import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "@/lib/config/env";
import { UnauthorizedError, ForbiddenError } from "@/lib/api/errors";
import { AdminRole } from "@/models/AdminUser";

export interface AdminJwtPayload {
  adminId: string;
  email: string;
  role: AdminRole;
  name: string;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwtSecret, options);
}

export function verifyAdminToken(token: string): AdminJwtPayload {
  try {
    return jwt.verify(token, config.jwtSecret) as AdminJwtPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired authentication token");
  }
}

export function extractBearerToken(req: Request): string {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization token required (Bearer <token>)");
  }
  return authHeader.substring(7).trim();
}

export async function requireAdminAuth(
  req: Request,
  allowedRoles?: AdminRole[]
): Promise<AdminJwtPayload> {
  const token = extractBearerToken(req);
  const payload = verifyAdminToken(token);

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(payload.role)) {
      throw new ForbiddenError(
        `Action forbidden for role '${payload.role}'. Requires one of: ${allowedRoles.join(", ")}`
      );
    }
  }

  return payload;
}
