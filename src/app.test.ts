/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// // eslint-disable-next-line @typescript-eslint/triple-slash-reference
// /// <reference path="../node_modules/@types/jest/index.d.ts" />

// import request from 'supertest';
// import { Response } from 'express';
// import { userController } from './controllers/userController';
// import app from './app';
// // import { CommunicationUserToken } from '@azure/communication-identity';
// // import { ResponseMode } from '@azure/msal-node';

// interface mockResponse {
//   //@ts-ignore
//   [key: string]: any;
// }

// // Setup mocks
// // const mockUserToken: CommunicationUserToken = {
// //   user: { communicationUserId: 'mock-token-user' },
// //   token: 'mock-token-value',
// //   expiresOn: new Date(0)
// // };

// const mockACSUser = { acsUserId: 'mock-user-id' };
// const mockUserResponse: mockResponse = { json: mockACSUser };

// let getACSUserSpy: jest.SpyInstance;

// beforeAll(() => {
//   getACSUserSpy = jest
//     .spyOn(userController, 'getACSUser')
//     .mockImplementation(async () => mockUserResponse as Response<any, Record<string, any>>);
// });

// describe('app router tests', () => {
//   test('/api/user should return an ACS user with GET', async () => {
//     const getResponse = await request(app).get('/api/user');
//     expect(getResponse.text).toEqual(JSON.stringify(mockACSUser));
//     getACSUserSpy.mockClear();
//   });
// });
