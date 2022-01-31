/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import {
  mockAcsUserId,
  mockAadToken,
  mockAuthorization,
  mockIdentityMapping,
  mockResponse,
  mockRequest
} from '../../utils/mockData';
import { createACSUser } from '../../../src/controllers/userController';
import * as acsService from '../../../src/services/acsService';
import * as aadService from '../../../src/services/aadService';
import * as graphService from '../../../src/services/graphService';

let exchangeAADTokenViaOBOSpy: jest.SpyInstance;
let getACSUserIdSpy: jest.SpyInstance;
let createACSUserIdentitySpy: jest.SpyInstance;
let addIdentityMappingSpy: jest.SpyInstance;

describe('User Controller - Create ACS User: ', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('when AAD token via OBO flow fails to be retrieved, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
  });

  test('when ACS user ID fails to be retrieved from Graph, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when no ACS user ID is stored in Graph and ACS identity fails to be created, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(undefined)));
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSUserIdentitySpy.mockClear();
  });

  test('when no ACS user ID is stored in Graph and Graph identity mapping fails to be added, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(undefined)));
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    addIdentityMappingSpy = jest
      .spyOn(graphService, 'addIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSUserIdentitySpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });

  test('when no ACS user ID is stored in Graph and ACS user is successfully created and mapped, it should return response with status 201 and identity mapping object.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(undefined)));
    createACSUserIdentitySpy = jest
      .spyOn(acsService, 'createACSUserIdentity')
      .mockImplementation(async () => mockAcsUserId);
    addIdentityMappingSpy = jest
      .spyOn(graphService, 'addIdentityMapping')
      .mockImplementation(async () => mockIdentityMapping);

    await createACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSUserIdentitySpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockIdentityMapping);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSUserIdentitySpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });

  test('when an ACS user ID is stored in Graph, it should return response with status 200 and ACS user ID as user identity.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);

    await createACSUser(req, res, () => {});

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acsUserIdentity: mockAcsUserId });
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });
});
