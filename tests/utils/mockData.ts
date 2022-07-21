/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationAccessToken, CommunicationUserToken } from '@azure/communication-identity';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../src/types/authenticatedRequest';

export const mockRequest = (authorization?: string, body?: string): Request => {
  const req = {
    headers: {},
    body: {}
  };

  if (authorization) {
    req.headers = {
      authorization: authorization
    };
  }

  if (body) {
    req.body = body;
  }

  return req as Request;
};

export const mockAuthenticatedRequest = (
  authorization?: string,
  userObjectId?: string,
  body?: string
): AuthenticatedRequest => {
  const req = mockRequest(authorization, body) as AuthenticatedRequest;
  if (authorization) {
    req.headers = {
      authorization: authorization
    };
  }

  if (userObjectId) {
    req.user = { oid: userObjectId };
  }

  return req as AuthenticatedRequest;
};

export const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

export const mockAcsUserId = 'mock-acs-user-id';
export const mockAadToken = 'mock-aad-token';
export const mockAuthorization = `mock-authorization-header ${mockAadToken}`;
export const mockAadUserObjectId = 'mock-aad-user-object-id';
export const mockAadTokenWithDelegatedPermissions = 'mock-aad-token-with-delegated-permissions';
export const mockIdentityMapping = { acsUserIdentity: 'mock-identity-mapping' };
export const mockCommunicationUserIdentifier: CommunicationUserIdentifier = {
  communicationUserId: 'mock-user-id'
};
export const mockCommunicationAccessToken: CommunicationAccessToken = {
  token: 'mock-access-token',
  expiresOn: new Date()
};
export const mockCommunicationUserToken: CommunicationUserToken = {
  user: { communicationUserId: mockAcsUserId },
  token: mockCommunicationAccessToken.token,
  expiresOn: mockCommunicationAccessToken.expiresOn
};
