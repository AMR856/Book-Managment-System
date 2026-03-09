import HttpMessages from "./statusMessages";

export default class CustomError extends Error {
  statusCode: number;
  statusMessage: string;
  isJoi?: boolean;
  constructor(message: string, statusCode = 500, statusMessage = HttpMessages.FAIL) {
    super(message);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
