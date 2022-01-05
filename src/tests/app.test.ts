/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import request from 'supertest';
import { Response } from 'express';
import { userController } from '../controllers/userController';
import app from '../app';

interface mockResponse {
  // @ts-ignore
  [key: string]: any;
}

const mockACSUser = 'mock-user-id';
const mockGetResponse: mockResponse = { acsUserId: mockACSUser };
const mockPostResponse: mockResponse = { acsUserIdentity: mockACSUser };
const mockDeleteResponse: mockResponse = { message: `Successfully deleted the ACS user identity ${mockACSUser}` };

let getACSUserSpy: jest.SpyInstance;
let createACSUserSpy: jest.SpyInstance;
let deleteACSUserSpy: jest.SpyInstance;

// beforeAll(() => {
// });

describe('app router tests', () => {
  test('/api/user should return an ACS identity with GET request', async () => {
    getACSUserSpy = jest
      .spyOn(userController, 'getACSUser')
      .mockImplementation(async () => {
        const parse = { json: mockGetResponse };
        return parse as Response<any, Record<string, any>>;
      });

    const getResponse = await request(app).get('/api/user/');

    expect(getACSUserSpy).toHaveBeenCalled();
    expect(getResponse.text).toEqual(JSON.stringify(mockGetResponse));
  });

  test('/api/user should create an ACS identity with POST request', async () => {
    createACSUserSpy = jest
      .spyOn(userController, 'createACSUser')
      .mockImplementation(async () => {
        const parse = { json: mockPostResponse };
        return parse as Response<any, Record<string, any>>;
      });

    const getResponse = await request(app).post('/api/user');

    expect(createACSUserSpy).toHaveBeenCalled();
    expect(getResponse.text).toEqual(JSON.stringify(mockPostResponse));
  });

  test('/api/user should create an ACS identity with POST request', async () => {
    deleteACSUserSpy = jest
      .spyOn(userController, 'deleteACSUser')
      .mockImplementation(async () => {
        const parse = { json: mockDeleteResponse };
        return parse as Response<any, Record<string, any>>;
      });

    const getResponse = await request(app).delete('/api/user');

    expect(deleteACSUserSpy).toHaveBeenCalled();
    expect(getResponse.text).toEqual(JSON.stringify(mockDeleteResponse));
  });
});
