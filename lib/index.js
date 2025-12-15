/**
 * CW Method RDD - Main Entry Point
 * Rules Driven Development System
 */

const { AppError } = require('./errors/AppError');
const { ErrorCodes } = require('./errors/ErrorCodes');

module.exports = {
  AppError,
  ErrorCodes,
  VERSION: '1.0.0'
};
