import { z } from "zod";

export const severitySchema = z.enum(["critical", "high", "medium", "low"]);
export const incidentStatusSchema = z.enum(["open", "acknowledged", "resolved"]);

export const incidentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().min(10),
  severity: severitySchema,
  status: incidentStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const incidentListSchema = z.array(incidentSchema);

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

export const authTokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const authResponseSchema = z.object({
  user: userSchema,
  tokens: authTokensSchema,
});

export type Severity = z.infer<typeof severitySchema>;
export type IncidentStatus = z.infer<typeof incidentStatusSchema>;
export type Incident = z.infer<typeof incidentSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
