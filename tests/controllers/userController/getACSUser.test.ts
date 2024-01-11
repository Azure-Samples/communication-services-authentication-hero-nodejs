/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { mockAcsUserId, mockMeidToken, mockAuthorization, mockResponse, mockRequest } from '../../utils/mockData';
import { getACSUser } from '../../../src/controllers/userController';
import * as aadService from '../../../src/services/aadService';
import * as graphService from '../../../src/services/graphService';

let exchangeMEIDTokenViaOBOSpy: jest.SpyInstance;
let getACSUserIdSpy: jest.SpyInstance;

describe('User Controller - Get ACS User :', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getACSUser(req, res, () => {
      return res.status(500);
    });

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('when Microsoft Entra token via OBO flow fails to be retrieved, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await getACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeMEIDTokenViaOBOSpy.mockClear();
  });

  test('when ACS user ID fails to be retrieved from Graph, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await getACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when no ACS user ID is stored in Graph, it should return a 404 error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(undefined)));

    await getACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when an ACS user ID is stored in Graph and all succeeds, it should return a response with status 200 and acsUserIdentity object.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);

    await getACSUser(req, res, () => {});

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acsUserIdentity: mockAcsUserId });
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });
});
