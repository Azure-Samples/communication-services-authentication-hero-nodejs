/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import {
  mockAcsUserId,
  mockAadToken,
  mockAuthorization,
  mockIdentityMapping,
  mockResponse,
  mockRequest
} from '../utils/mockData';
import { createACSUser } from '../../src/controllers/userController';
import * as acsService from '../../src/services/acsService';
import * as aadService from '../../src/services/aadService';
import * as graphService from '../../src/services/graphService';

let createACSUserIdentitySpy: jest.SpyInstance;
let exchangeAADTokenViaOBOSpy: jest.SpyInstance;
let addIdentityMappingSpy: jest.SpyInstance;

describe('create ACS user: ', () => {
  test('when ACS identity fails to be created, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createACSUserIdentitySpy.mockClear();
  });

  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createACSUserIdentitySpy.mockClear();
  });

  test('when AAD token via OBO flow fails to be retrieved, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    createACSUserIdentitySpy.mockClear();
    exchangeAADTokenViaOBOSpy.mockClear();
  });

  test('when Graph identity mapping fails to be added, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    addIdentityMappingSpy = jest
      .spyOn(graphService, 'addIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await createACSUser(req, res, () => {
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

  test('when all succeeds, it should return response with status 200 and identity mapping object.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    addIdentityMappingSpy = jest
      .spyOn(graphService, 'addIdentityMapping')
      .mockImplementation(async () => mockIdentityMapping);

    await createACSUser(req, res, () => {});

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