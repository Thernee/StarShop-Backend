/* eslint-disable no-unused-vars */
import winston from 'winston';
import { NextFunction, Request, Response } from 'express';
import { AppError, BadRequestError, InternalError, NotFoundError } from './error.classes';
import { HttpException } from '@nestjs/common';
import { ValidationError } from '../utils/errors';

const TESTING: boolean = process.env.NODE_ENV === 'TEST';

const files = new winston.transports.File({ filename: 'logs/error.log' });
winston.add(files);

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const error = { ...err };
  error.message = err.message;

  const TESTING: boolean = process.env.NODE_ENV === 'TEST';

  !TESTING && console.log((err as any).stack);

  if (err instanceof AppError) {
    AppError.handle(err, res);
  } else {
    if (err.name === 'CastError') {
      AppError.handle(new NotFoundError('resource not found'), res);
    }

    if ((err as any).code === 11000) {
      let field = err.message.split('index:')[1];
      field = field.split(' dup key')[0];
      field = field.substring(0, field.lastIndexOf('_')).trim();
      const message = `${field} already exists`;
      AppError.handle(new BadRequestError(message), res);
    }

    if (err.name === 'ValidationError') {
      const message: string = Object.values((err as any).errors)
        .map((val: any): string => val.message)
        .join(', ');
      AppError.handle(new BadRequestError(message), res);
    }

    if (error.message === 'Route Not found') {
      AppError.handle(new NotFoundError('requested resource not found'), res);
    }

    winston.error(err.stack);
    AppError.handle(new InternalError(), res);
  }
};

export const errorHandlerNest = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      statusCode: error.getStatus(),
      message: error.message,
      error: error.name,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message,
      error: 'Validation Error',
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    error: 'Internal Server Error',
  });
};

export default errorHandler;
