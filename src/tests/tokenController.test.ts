/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import { CommunicationAccessToken } from '@azure/communication-identity';
import { Client, GraphRequest } from '@microsoft/microsoft-graph-client';
import { Request, Response } from 'express';
import { tokenController } from '../controllers/tokenController';
import { acsService } from '../services/acsService';
import { aadService } from '../services/aadService';
import { graphService } from '../services/graphService';

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
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockAcsUserId = 'mock-acs-user-id';
const mockAuthorization = 'testing mock-authorization';
const mockAadOboToken = 'mock-aad-obo-token';
const mockToken: CommunicationAccessToken = {
  token: 'mock-access-token',
  expiresOn: new Date()
};

let getACSUserIdSpy: jest.SpyInstance;
let createACSTokenSpy: jest.SpyInstance;
let exchangeAADTokenViaOBOSpy: jest.SpyInstance;

describe('tokenController.getACSToken', () => {
  test('should return a 401 error when request has no authorization in headers', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await tokenController.getACSToken(req, res, () => {
      return res.status(500);
    });

    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  test('should return an error when call to aadService.exchangeAADTokenViaOBO fails', async () => {
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

  test('should return an error when call to graphService.getACSUserId fails', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadOboToken);
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

  test('should return an error when call to acsService.createACSToken fails', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadOboToken);
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

  test('should return a response with status 200 and acsUserId when call to graphService.getACSUserId succeeds ', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadOboToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    createACSTokenSpy = jest.spyOn(acsService, 'createACSToken').mockImplementation(async () => mockToken);

    await tokenController.getACSToken(req, res, () => {});

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
