/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import * as utils from './utils/utils';
// Routes
import { tokenRouter } from './routes/tokenRouter';
import { userRouter } from './routes/userRouter';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Api routes
app.use('/api/', userRouter());
app.use('/api/', tokenRouter());

// Any other route is going to wind up at the app.all() function defined.
// The all() method encompasses all types of requests, including GET and PATCH, and the asterisk accepts any URL.
// From there, define a middleware that sends a JSend response.
/* eslint-disable @typescript-eslint/no-unused-vars */
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const statusCode = 404;
  const errorMessage = `The ${req.originalUrl} endpoint is invalid!`;
  const errorResponse = utils.createErrorResponse(statusCode, errorMessage);

  res.status(statusCode).send(errorResponse);
});

// The best practice is to manage error handling in one place (Keep controllers cleaner and simpler)
// As long as having these four arguments, Express will recognize the middleware as an error handling middleware.
/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = 500;
  const errorResponse = utils.createErrorResponse(statusCode, err.message, err.stack);

  res.status(statusCode).send(errorResponse);
});

export default app;
