/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
// <reference path="../../node_modules/@types/jest/index.d.ts" />

// import { Request, Response } from 'express';
// import { userController } from '../controllers/userController';
// import { acsService } from '../services/acsService';
// import { graphService } from '../services/graphService';
// import { IdentityMapping } from '../types/identityMapping';

// const mockRequest = (): Request => {
//   return {} as Request;
// };

// const mockResponse = (): Response => {
//   const res: any = {};
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res as Response;
// };

// const mockAcsUserId = 'mock-acs-user-id';

// let getACSUserIdSpy: jest.SpyInstance;

// describe('userController.createACSUser', () => {
//   const mockIdentityMapping: IdentityMapping = {
//     acsUserIdentity: 'mock-identity-mapping'
//   };

//   let createAuthenticatedClientSpy: jest.SpyInstance;
//   let addIdentityMappingSpy: jest.SpyInstance;

//   test('should return an error when call to acsService.createACSUserIdentity fails', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     createAuthenticatedClientSpy = jest
//       .spyOn(acsService, 'createACSUserIdentity')
//       .mockImplementation(async () => undefined);

//     await userController.createACSUser(req, res, () => {
//       return res.status(500);
//     });

//     expect(createAuthenticatedClientSpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     createAuthenticatedClientSpy.mockClear();
//   });

//   test('should call graphService and return response with status 200 and identity mapping object when call to acsService.createACSUserIdentity succeeds', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     createAuthenticatedClientSpy = jest
//       .spyOn(acsService, 'createACSUserIdentity')
//       .mockImplementation(async () => mockAcsUserId);
//     addIdentityMappingSpy = jest.spyOn(graphService, 'addIdentityMapping').mockImplementation(async () => {
//       return mockIdentityMapping;
//     });

//     await userController.createACSUser(req, res, () => {});

//     expect(createAuthenticatedClientSpy).toHaveBeenCalled();
//     expect(addIdentityMappingSpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockIdentityMapping);
//     createAuthenticatedClientSpy.mockClear();
//     addIdentityMappingSpy.mockClear();
//   });
// });

// describe('userController.getACSUser', () => {
//   test('should return an error when call to graphService.getACSUserId fails', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     getACSUserIdSpy = jest
//       .spyOn(graphService, 'getACSUserId')
//       .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

//     await userController.getACSUser(req, res, () => {
//       return res.status(500);
//     });

//     expect(getACSUserIdSpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     getACSUserIdSpy.mockClear();
//   });

//   test('should return a response with status 200 and acsUserId when call to graphService.getACSUserId succeeds ', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);

//     await userController.getACSUser(req, res, () => {});

//     expect(getACSUserIdSpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ acsUserId: mockAcsUserId });
//     getACSUserIdSpy.mockClear();
//   });
// });

// describe('userController.deleteACSUser', () => {
//   let deleteIdentityMappingSpy: jest.SpyInstance;
//   let deleteACSUserIdentitySpy: jest.SpyInstance;

//   test('should return an error when call to graphService.getACSUserId fails', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     getACSUserIdSpy = jest
//       .spyOn(graphService, 'getACSUserId')
//       .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

//     await userController.deleteACSUser(req, res, () => {
//       return res.status(500);
//     });

//     expect(getACSUserIdSpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     getACSUserIdSpy.mockClear();
//   });

//   test('should return an error when call to graphService.deleteIdentityMapping fails', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
//     deleteIdentityMappingSpy = jest
//       .spyOn(graphService, 'deleteIdentityMapping')
//       .mockImplementation(async () => new Promise((resolve, reject) => reject()));

//     await userController.deleteACSUser(req, res, () => {
//       return res.status(500);
//     });

//     expect(getACSUserIdSpy).toHaveBeenCalled();
//     expect(deleteIdentityMappingSpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     getACSUserIdSpy.mockClear();
//     deleteIdentityMappingSpy.mockClear();
//   });

//   test('should return an error when call to acsService.deleteACSUserIdentity fails', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
//     deleteIdentityMappingSpy = jest
//       .spyOn(graphService, 'deleteIdentityMapping')
//       .mockImplementation(async () => new Promise((resolve, reject) => resolve()));
//     deleteACSUserIdentitySpy = jest
//       .spyOn(acsService, 'deleteACSUserIdentity')
//       .mockImplementation(async () => new Promise((resolve, reject) => reject()));

//     await userController.deleteACSUser(req, res, () => {
//       return res.status(500);
//     });

//     expect(getACSUserIdSpy).toHaveBeenCalled();
//     expect(deleteIdentityMappingSpy).toHaveBeenCalled();
//     expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     getACSUserIdSpy.mockClear();
//     deleteIdentityMappingSpy.mockClear();
//     deleteACSUserIdentitySpy.mockClear();
//   });

//   test('should return a response with status 200 when all deletion succeed ', async () => {
//     const res = mockResponse();
//     const req = mockRequest();
//     getACSUserIdSpy = jest.spyOn(graphService, 'getACSUserId').mockImplementation(async () => mockAcsUserId);
//     deleteIdentityMappingSpy = jest
//       .spyOn(graphService, 'deleteIdentityMapping')
//       .mockImplementation(async () => new Promise((resolve, reject) => resolve()));
//     deleteACSUserIdentitySpy = jest
//       .spyOn(acsService, 'deleteACSUserIdentity')
//       .mockImplementation(async () => new Promise((resolve, reject) => resolve()));

//     await userController.deleteACSUser(req, res, () => {
//       return res.status(500);
//     });

//     expect(getACSUserIdSpy).toHaveBeenCalled();
//     expect(deleteIdentityMappingSpy).toHaveBeenCalled();
//     expect(deleteACSUserIdentitySpy).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     getACSUserIdSpy.mockClear();
//     deleteIdentityMappingSpy.mockClear();
//     deleteACSUserIdentitySpy.mockClear();
//   });
// });
