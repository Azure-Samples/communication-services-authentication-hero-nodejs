/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationAccessToken, CommunicationUserToken } from '@azure/communication-identity';
import { Request, Response } from 'express';

export const mockRequest = (authorization?: string): Request => {
  const req = {
    headers: {}
  };

  if (authorization) {
    req.headers = {
      authorization: authorization
    };
  }

  return req as Request;
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
export const mockIdentityMapping = { acsUserIdentity: 'mock-identity-mapping' };
export const mockCommunicationUserIdentifier: CommunicationUserIdentifier = {
  communicationUserId: 'mock-user-id'
};
export const mockAccessToken: CommunicationAccessToken = {
  token: 'mock-access-token',
  expiresOn: new Date()
};
export const mockCommunicationUserToken: CommunicationUserToken = {
  user: { communicationUserId: mockAcsUserId },
  token: mockAccessToken.token,
  expiresOn: mockAccessToken.expiresOn
};
