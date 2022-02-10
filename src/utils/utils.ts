/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../types/errorResponse';
import jwtDecode, { JwtPayload } from 'jwt-decode';

const GET_AUTHORIZATION_CODE_ERROR = 'Fail to get the authorization code from the request header';
const AAD_EXPIRATION_ERROR = 'The AAD token provided is already expired';

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

  // Verify if the AAD token is expired
  const decodedToken: JwtPayload = jwtDecode(authHeader.split(' ')[1]);
  if (Date.now() >= decodedToken.exp * 1000) {
    return res.status(401).json(createErrorResponse(401, AAD_EXPIRATION_ERROR));
  }

  next();
};
