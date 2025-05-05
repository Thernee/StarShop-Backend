/* eslint-disable no-unused-vars */
import winston from 'winston';
import { NextFunction, Request, Response } from 'express';
import { AppError, BadRequestError, InternalError, NotFoundError } from './error.classes';

const TESTING: boolean = process.env.NODE_ENV === 'TEST';

const files = new winston.transports.File({ filename: 'logs/error.log' });
winston.add(files);

// const errorHandler = (err: any, req: Request, res: Response,  next: NextFunction) => {
//   const error = { ...err };

//   error.message = err.message;

//   // Log to console for dev
//   !TESTING && console.log((err as any).stack);

//   console.log(err instanceof AppError, 'instance');
//   if (err instanceof AppError == true) {
//     AppError.handle(err, res);
//   } else {
//     // Mongoose bad ObjectId
//     if (err.name === 'CastError') {
//       AppError.handle(new NotFoundError('resource not found'), res);
//     }

//     // Mongoose duplicate key
//     if ((err as any).code === 11000) {
//       // get the dup key field out of the err message
//       let field = err.message.split('index:')[1];
//       // now we have `field_1 dup key`
//       field = field.split(' dup key')[0];
//       field = field.substring(0, field.lastIndexOf('_')); // returns field
//       field = field.trim();
//       const message = `${field} already exists`;
//       AppError.handle(new BadRequestError(message), res);
//     }

//     // Mongoose validation error
//     if (err.name === 'ValidationError') {
//       const message: string = Object.values((err as any).errors)
//         .map((val: any): string => val.message)
//         .join(', ');
//       AppError.handle(new BadRequestError(message), res);
//     }

//     if (error.message === 'Route Not found') {
//       AppError.handle(new NotFoundError('requested resource not found'), res);
//     }

//     winston.error(err.stack);

//     AppError.handle(new InternalError(), res);
//   }
// };


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

// export default errorHandler;


export default errorHandler;
