/**
 * Clase base de errores estandarizada
 * CW Method RDD - Error Handling Standard
 */

const crypto = require('crypto');

class AppError extends Error {
  constructor(code, message, details = null, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.message = message;
    this.details = details;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.trace_id = crypto.randomUUID();
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: process.env.NODE_ENV === 'production' ? null : this.details,
        timestamp: this.timestamp,
        trace_id: this.trace_id
      }
    };
  }

  toResponse() {
    return {
      ...this.toJSON(),
      statusCode: this.statusCode
    };
  }
}

module.exports = { AppError };
