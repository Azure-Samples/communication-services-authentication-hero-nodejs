/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import { Request, Response } from 'express';
import { userController } from '../../src/controllers/userController';
import { acsService }from '../../src/services/acsService';
import { aadService } from '../../src/services/aadService';
import { graphService } from '../../src/services/graphService';

const mockRequest = (authorization?: string): Request => {
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

const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockAcsUserId = 'mock-acs-user-id';
const mockAadToken = 'mock-aad-token';
const mockAuthorization = `mock-authorization-header ${mockAadToken}`;

let getACSUserIdSpy: jest.SpyInstance;
let exchangeAADTokenViaOBOSpy: jest.SpyInstance;

describe('create ACS user: ', () => {
  const mockIdentityMapping: IdentityMapping = {
    acsUserIdentity: 'mock-identity-mapping'
  };

  let createACSUserIdentitySpy: jest.SpyInstance;
  let addIdentityMappingSpy: jest.SpyInstance;

  test('when ACS identity fails to be created, it should return an error', async () => {
    const req = mockRequest();
    const res = mockResponse();
    createACSUserIdentitySpy= jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => undefined);

    await userController.createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createACSUserIdentitySpy.mockClear();
  });

  test('when request has no authorization header, it should return an error', async () => {
    const req = mockRequest();
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);

    await userController.createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createACSUserIdentitySpy.mockClear();
  });

  test('when AAD token via OBO flow fails to be retrieved, it should return an error', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => undefined);

    await userController.createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createACSUserIdentitySpy.mockClear();
    exchangeAADTokenViaOBOSpy.mockClear();
  });

  test('when Graph identity mapping fails to be added, it should return an error', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    addIdentityMappingSpy = jest.spyOn(graphService, 'addIdentityMapping').mockImplementation(async () => new Promise((resolve, reject) => reject(null)));

    await userController.createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createACSUserIdentitySpy.mockClear();
    exchangeAADTokenViaOBOSpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });

  test('should call graphService and return response with status 200 and identity mapping object when call to acsService.createACSUserIdentity succeeds', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    addIdentityMappingSpy = jest.spyOn(graphService, 'addIdentityMapping').mockImplementation(async () => {
      return mockIdentityMapping;
    });

    await userController.createACSUser(req, res, () => {});

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockIdentityMapping);
    createACSUserIdentitySpy.mockClear();
    exchangeAADTokenViaOBOSpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });
});
