/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import { Request, Response } from 'express';
import { userController } from '../controllers/userController';
import { acsService } from '../services/acsService';
import { graphService } from '../services/graphService';
import { IdentityMapping } from '../types/identityMapping';

const mockRequest = (): Request => {
  return {} as Request;
};

const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockIdentityMapping: IdentityMapping = {
  acsUserIdentity: 'mock-identity-mapping'
};

let createAuthenticatedClientSpy: jest.SpyInstance;
let addIdentityMappingSpy: jest.SpyInstance;

describe('userController.createACSUser', () => {
  test('should return an error when ACS identity creation fails', async () => {
    const res = mockResponse();
    const req = mockRequest();
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => undefined);

    await userController.createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createAuthenticatedClientSpy.mockClear();
  });

  test('should call graphService when ACS identity creation succeeds and return response with status 200 and identity mapping object', async () => {
    const res = mockResponse();
    const req = mockRequest();
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => 'mock-ACS-user-id');
    addIdentityMappingSpy = jest.spyOn(graphService, 'addIdentityMapping').mockImplementation(async () => {
      return mockIdentityMapping;
    });

    await userController.createACSUser(req, res, () => {});

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockIdentityMapping);
    createAuthenticatedClientSpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });
});
