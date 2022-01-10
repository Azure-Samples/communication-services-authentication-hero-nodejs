/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import { Request, Response } from 'express';
import { userController } from '../../src/controllers/userController';
import { acsService } from '../../src/services/acsService';
import { graphService } from '../../src/services/graphService';

const mockRequest = (): Request => {
  return {} as Request;
};

const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockAcsUserId = 'mock-acs-user-id';

let getACSUserIdSpy: jest.SpyInstance;

describe('userController.deleteACSUser', () => {
  let deleteIdentityMappingSpy: jest.SpyInstance;
  let deleteACSUserIdentitySpy: jest.SpyInstance;

  test('should return an error when call to graphService.getACSUserId fails', async () => {
    const res = mockResponse();
    const req = mockRequest();
    getACSUserIdSpy = jest
      .spyOn(graphService, 'getACSUserId')
      .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    getACSUserIdSpy.mockClear();
  });

  test('should return an error when call to graphService.deleteIdentityMapping fails', async () => {
    const res = mockResponse();
    const req = mockRequest();
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => reject()));

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
  });

  test('should return an error when call to acsService.deleteACSUserIdentity fails', async () => {
    const res = mockResponse();
    const req = mockRequest();
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve()));
    deleteACSUserIdentitySpy = jest
      .spyOn(acsService, 'deleteACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => reject()));

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
    deleteACSUserIdentitySpy.mockClear();
  });

  test('should return a response with status 200 when all deletion succeed ', async () => {
    const res = mockResponse();
    const req = mockRequest();
    getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
    deleteIdentityMappingSpy = jest
      .spyOn(graphService, 'deleteIdentityMapping')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve()));
    deleteACSUserIdentitySpy = jest
      .spyOn(acsService, 'deleteACSUserIdentity')
      .mockImplementation(async () => new Promise((resolve, reject) => resolve()));

    await userController.deleteACSUser(req, res, () => {
      return res.status(500);
    });

    expect(getACSUserIdSpy).toHaveBeenCalled();
    expect(deleteIdentityMappingSpy).toHaveBeenCalled();
    expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    getACSUserIdSpy.mockClear();
    deleteIdentityMappingSpy.mockClear();
    deleteACSUserIdentitySpy.mockClear();
  });
});
