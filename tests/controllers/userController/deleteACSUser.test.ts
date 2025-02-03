/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { mockAcsUserId, mockMeidToken, mockAuthorization, mockResponse, mockRequest } from '../../utils/mockData';
import { deleteACSUser } from '../../../src/controllers/userController';
import * as acsService from '../../../src/services/acsService';
import * as meidService from '../../../src/services/aadService';
import * as graphService from '../../../src/services/graphService';

let exchangeMEIDTokenViaOBOSpy: jest.SpyInstance;
let getACSUserIdSpy: jest.SpyInstance;
let deleteIdentityMappingSpy: jest.SpyInstance;
let deleteACSUserIdentitySpy: jest.SpyInstance;

describe('User Controller - Delete ACS User: ', () => {
  test('when request has no authorization header, it should return an error.', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('when Microsoft Entra token via OBO flow fails to be retrieved, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(meidService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await deleteACSUser(req, res, () => {
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
      .spyOn(meidService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
  });

  test('when Graph identity mapping fails to be deleted, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(meidService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(false)));

    await deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
  });

  test('when ACS user identity fails to be deleted, it should return an error.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(meidService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(true)));
    deleteACSUserIdentitySpy = jest
      .spyOn(acsService, 'deleteACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => reject()));

    await deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
    deleteACSUserIdentitySpy.mockClear();
  });

  test('when all succeeds, itshould return a response with status 204.', async () => {
    const req = mockRequest(mockAuthorization);
    const res = mockResponse();
    exchangeMEIDTokenViaOBOSpy = jest
      .spyOn(meidService, 'exchangeMEIDTokenViaOBO')
      .mockImplementation(async () => mockMeidToken);
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve(true)));
    deleteACSUserIdentitySpy = jest
      .spyOn(acsService, 'deleteACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve()));

    await deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(exchangeMEIDTokenViaOBOSpy).toHaveBeenCalled();
    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    exchangeMEIDTokenViaOBOSpy.mockClear();
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
    deleteACSUserIdentitySpy.mockClear();
  });
});
