/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../types/errorResponse';

const GET_AUTHORIZATION_CODE_ERROR = 'Fail to get the authorization code from the request header';

// Get an AAD token passed through request header
export const getAADTokenViaRequest = (req: Request): string => {
  return req.headers.authorization.split(' ')[1];
};

// Create an error response
export const createErrorResponse = (code: number, message: string, stack_trace?: string): ErrorResponse => {
  return {
    code: code,
    message: message,
    stack_trace: stack_trace
  };
};

// A middleware function used to check if get the authorization code from the request header successfully
export const validateAuthorizedHeader = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.split(' ')[1]) {
    return res.status(401).json(createErrorResponse(401, GET_AUTHORIZATION_CODE_ERROR));
  }
  next();
};
