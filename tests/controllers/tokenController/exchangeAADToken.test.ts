/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { exchangeAADToken } from '../../../src/controllers/tokenController';
import {
  mockCommunicationAccessToken,
  mockAuthorization,
  mockRequest,
  mockResponse,
  mockAuthenticatedRequest,
  mockAadUserObjectId,
  mockAadTokenWithDelegatedPermissions
} from '../../utils/mockData';
import * as acsService from '../../../src/services/acsService';

let getACSTokenForTeamsUserSpy: jest.SpyInstance;

describe('Token Controller - Exchange AAD Token: ', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await exchangeAADToken(req, res, () => {
      return res.status(500);
    });

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('when failing to get ACS Token for Teams User, it should return an error.', async () => {
    const req = mockAuthenticatedRequest(mockAuthorization, mockAadUserObjectId, mockAadTokenWithDelegatedPermissions);
    const res = mockResponse();
    getACSTokenForTeamsUserSpy = jest
      .spyOn(acsService, 'getACSTokenForTeamsUser')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await exchangeAADToken(req, res, () => {
      return res.status(500);
    });

    expect(getACSTokenForTeamsUserSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    getACSTokenForTeamsUserSpy.mockClear();
  });

  test('when successful to get ACS Token for Teams User, it should return a response with status 201 and an ACS token object.', async () => {
    const req = mockAuthenticatedRequest(mockAuthorization, mockAadUserObjectId, mockAadTokenWithDelegatedPermissions);
    const res = mockResponse();
    getACSTokenForTeamsUserSpy = jest
      .spyOn(acsService, 'getACSTokenForTeamsUser')
      .mockImplementation(async () => mockCommunicationAccessToken);

    await exchangeAADToken(req, res, () => {
      return res.status(500);
    });

    expect(getACSTokenForTeamsUserSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCommunicationAccessToken);
    getACSTokenForTeamsUserSpy.mockClear();
  });
});
