/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import { CommunicationAccessToken, CommunicationUserToken } from '@azure/communication-identity';
import {
  mockAcsUserId,
  mockAadToken,
  mockAuthorization,
  mockIdentityMapping,
  mockResponse,
  mockRequest
} from '../utils/mockData';
import { tokenController } from '../../src/controllers/tokenController';
import { acsService } from '../../src/services/acsService';
import { aadService } from '../../src/services/aadService';
import { graphService } from '../../src/services/graphService';

const mockToken: CommunicationAccessToken = {
  token: 'mock-access-token',
  expiresOn: new Date()
};
const mockCommunicationUserToken: CommunicationUserToken = {
  user: { communicationUserId: mockAcsUserId },
  token: mockToken.token,
  expiresOn: mockToken.expiresOn
};

let getACSUserIdSpy: jest.SpyInstance;
let createACSTokenSpy: jest.SpyInstance;
let exchangeAADTokenViaOBOSpy: jest.SpyInstance;
let createACSUserIdentityAndTokenSpy: jest.SpyInstance;
let addIdentityMappingSpy: jest.SpyInstance;

describe('Get ACS Token: ', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await tokenController.getACSToken(req, res, () => {
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

    await tokenController.getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
  });

  test('when ACS user ID fails to be retrieved, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await tokenController.getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when there is no identity mapping information stored in Graph and ACS user fails to be created, it should return an error.', async () => {
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

    await tokenController.getACSToken(req, res, () => {
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

  test('when there is no identity mapping information stored in Graph and Graph identity mapping fails to be added, it should return an error.', async () => {
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

    await tokenController.getACSToken(req, res, () => {
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

  test('when there is no identity mapping information stored in Graph and ACS user is created and mapped, it should return a response with status 200 and an ACS token object.', async () => {
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

    await tokenController.getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSUserIdentityAndTokenSpy).toHaveBeenCalled();
    expect(addIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockToken);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSUserIdentityAndTokenSpy.mockClear();
    addIdentityMappingSpy.mockClear();
  });

  test('when an identity mapping information is stored in Graph and ACS token fails to be created, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    createACSTokenSpy = jest
      .spyOn(acsService, 'createACSToken')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await tokenController.getACSToken(req, res, () => {
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

  test('when an identity mapping information is stored in Graph and all succeeds, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    createACSTokenSpy = jest.spyOn(acsService, 'createACSToken').mockImplementation(async () => mockToken);

    await tokenController.getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSTokenSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockToken);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSTokenSpy.mockClear();
  });
});
