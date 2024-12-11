/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import {
  mockMeidToken,
  mockCommunicationAccessToken,
  mockAcsUserId,
  mockAuthorization,
  mockCommunicationUserToken,
  mockRequest,
  mockResponse
} from '../../utils/mockData';
import { getACSToken } from '../../../src/controllers/tokenController';
import * as acsService from '../../../src/services/acsService';
import * as aadService from '../../../src/services/aadService';
import * as graphService from '../../../src/services/graphService';

let getACSUserIdSpy: jest.SpyInstance;
let createACSTokenSpy: jest.SpyInstance;
let exchangeMEIDTokenViaOBOSpy: jest.SpyInstance;

describe('Token Controller - Get ACS Token: ', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getACSToken(req, res, () => {
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

    await getACSToken(req, res, () => {
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

    await getACSToken(req, res, () => {
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

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when an ACS user ID is stored in Graph and ACS token fails to be created, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    createACSTokenSpy = jest
      .spyOn(acsService, 'createACSToken')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSTokenSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSTokenSpy.mockClear();
  });

  test('when an ACS user ID is stored in Graph and all succeeds, it should return a response with status 201 and an ACS token object.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    createACSTokenSpy = jest
      .spyOn(acsService, 'createACSToken')
      .mockImplementation(async () => mockCommunicationAccessToken);

    await getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(createACSTokenSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCommunicationUserToken);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    createACSTokenSpy.mockClear();
  });
});
