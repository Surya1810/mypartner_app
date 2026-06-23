import type { H3Event } from "h3";

export function ok<T>(event: H3Event, data: T, statusCode = 200) {
  setResponseStatus(event, statusCode);
  return { success: true, data };
}

export function okList<T>(
  event: H3Event,
  data: T[],
  meta: { total: number; page: number; limit: number; totalPages: number },
) {
  return { success: true, data, meta };
}

export function fail(
  event: H3Event,
  message: string,
  statusCode = 400,
  errors?: { field: string; message: string }[],
) {
  setResponseStatus(event, statusCode);
  return { success: false, message, ...(errors ? { errors } : {}) };
}
