/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import { Request, Response } from 'express';
import { userController } from '../../src/controllers/userController';
import { acsService } from '../../src/services/acsService';
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

let exchangeAADTokenViaOBOSpy: jest.SpyInstance;
let getACSUserIdSpy: jest.SpyInstance;
let deleteIdentityMappingSpy: jest.SpyInstance;
let deleteACSUserIdentitySpy: jest.SpyInstance;

describe('Delete ACS User: ', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await userController.deleteACSUser(req, res, () => {
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

    await userController.deleteACSUser(req, res, () => {
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

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when Graph identity mapping fails to be deleted, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(false)));

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
  });

  test('when ACS user identity fails to be deleted, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(true)));
    deleteACSUserIdentitySpy = jest
      .spyOn(acsService, 'deleteACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => reject()));

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
    deleteACSUserIdentitySpy.mockClear();
  });

  test('when all succeed, itshould return a response with status 200.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeAADTokenViaOBOSpy = jest
      .spyOn(aadService, 'exchangeAADTokenViaOBO')
      .mockImplementation(async () => mockAadToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(true)));
    deleteACSUserIdentitySpy = jest
      .spyOn(acsService, 'deleteACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve()));

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeAADTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    exchangeAADTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
    deleteACSUserIdentitySpy.mockClear();
  });
});
