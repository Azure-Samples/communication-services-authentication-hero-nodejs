/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import {
  mockAadToken,
  mockAccessToken,
  mockAcsUserId,
  mockAuthorization,
  mockCommunicationUserToken,
  mockIdentityMapping,
  mockRequest,
  mockResponse
} from '../utils/mockData';
import { getACSToken } from '../../src/controllers/tokenController';
import * as acsService from '../../src/services/acsService';
import * as aadService from '../../src/services/aadService';
import * as graphService from '../../src/services/graphService';

let getACSUserIdSpy: jest.SpyInstance;
let createACSTokenSpy: jest.SpyInstance;
let exchangeAADTokenViaOBOSpy: jest.SpyInstance;
let createACSUserIdentityAndTokenSpy: jest.SpyInstance;
let addIdentityMappingSpy: jest.SpyInstance;

describe('Token Controller - Get ACS Token: ', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getACSToken(req, res, () => {
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

    await getACSToken(req, res, () => {
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

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when no ACS user ID is stored in Graph and ACS identity an token fail to be created, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(undefined)));
    createACSUserIdentityAndTokenSpy = jest
      .spyOn(acsService, 'createACSUserIdentityAndToken')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSUserIdentityAndTokenSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSUserIdentityAndTokenSpy.mockClear();
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
    createACSUserIdentityAndTokenSpy = jest
      .spyOn(acsService, 'createACSUserIdentityAndToken')
      .mockImplementation(async () => mockCommunicationUserToken);
    addIdentityMappingSpy = jest
      .spyOn(graphService, 'addIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSUserIdentityAndTokenSpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSUserIdentityAndTokenSpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });

  test('when no ACS user ID is stored in Graph and ACS user is successfully created and mapped, it should return a response with status 200 and an ACS token object.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(undefined)));
    createACSUserIdentityAndTokenSpy = jest
      .spyOn(acsService, 'createACSUserIdentityAndToken')
      .mockImplementation(async () => mockCommunicationUserToken);
    addIdentityMappingSpy = jest
      .spyOn(graphService, 'addIdentityMapping')
      .mockImplementation(async () => mockIdentityMapping);

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSUserIdentityAndTokenSpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAccessToken);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSUserIdentityAndTokenSpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });

  test('when an ACS user ID is stored in Graph and ACS token fails to be created, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    createACSTokenSpy = jest
      .spyOn(acsService, 'createACSToken')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSTokenSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSTokenSpy.mockClear();
  });

  test('when an ACS user ID is stored in Graph and all succeeds, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    createACSTokenSpy = jest.spyOn(acsService, 'createACSToken').mockImplementation(async () => mockAccessToken);

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSTokenSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAccessToken);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSTokenSpy.mockClear();
  });
});
