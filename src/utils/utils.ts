/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request } from 'express';
import { ErrorResponse } from '../types/errorResponse';
import * as jwt from 'express-jwt';
import jwksRsa, { GetVerificationKey } from 'jwks-rsa';
import { appSettings } from '../appSettings';
import jwtAuthz from 'express-jwt-authz';

// Get an Microsoft Entra token passed through request header
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

/**
 * Middleware to check the token integrity and validity.
 * By default, the middleware will check the token signature, expiration, and set the user object in the request.
 */
export const checkJwt = jwt.expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://login.microsoftonline.com/${appSettings.azureActiveDirectory.tenantId}/discovery/keys?appid=${appSettings.azureActiveDirectory.clientId}` // Obtain public signing keys from a well-known URL
  }) as GetVerificationKey,
  requestProperty: 'user', // Name of the property in the request object where the payload is set.
  algorithms: ['RS256']
});

/**
 * Middleware to check whether the token has the required scopes.
 */
export const checkScope = jwtAuthz(['access_as_user'], { customScopeKey: 'scp' });
