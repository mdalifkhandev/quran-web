export type QfErrorCode = 400 | 401 | 403 | 404 | 422 | 429 | 500;

export class QfHttpError extends Error {
  status: number;
  payload?: unknown;
  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}
