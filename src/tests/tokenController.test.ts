/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts" />

import { CommunicationAccessToken } from '@azure/communication-identity';
import { Request, Response } from 'express';
import { tokenController } from '../controllers/tokenController';
import { acsService } from '../services/acsService';
import { graphService } from '../services/graphService';

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
const mockToken: CommunicationAccessToken = {
    token: 'mock-access-token',
    expiresOn: new Date()
}

let getACSUserIdSpy: jest.SpyInstance;
let createACSTokenSpy: jest.SpyInstance;

describe('tokenController.getACSToken', () => {
    test('should return an error when call to graphService.getACSUserId fails', async () => {
        const res = mockResponse();
        const req = mockRequest();
        getACSUserIdSpy = jest
            .spyOn(graphService, 'getACSUserId')
            .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

        await tokenController.getACSToken(req, res, () => {
            return res.status(500);
        });

        expect(getACSUserIdSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        getACSUserIdSpy.mockClear();
    });

    test('should return an error when call to acsService.createACSToken fails', async () => {
        const res = mockResponse();
        const req = mockRequest();
        getACSUserIdSpy = jest
            .spyOn(graphService, 'getACSUserId')
            .mockImplementation(async () => mockAcsUserId);
        createACSTokenSpy = jest
            .spyOn(acsService, 'createACSToken')
            .mockImplementation(async () => new Promise((resolve, reject) => reject(undefined)));

        await tokenController.getACSToken(req, res, () => {
            return res.status(500);
        });

        expect(getACSUserIdSpy).toHaveBeenCalled();
        expect(createACSTokenSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        getACSUserIdSpy.mockClear();
        createACSTokenSpy.mockClear();
    });
  
    test('should return a response with status 200 and acsUserId when call to graphService.getACSUserId succeeds ', async () => {
        const res = mockResponse();
        const req = mockRequest();
        getACSUserIdSpy = jest
            .spyOn(graphService, 'getACSUserId')
            .mockImplementation(async () => mockAcsUserId);
        createACSTokenSpy = jest
            .spyOn(acsService, 'createACSToken')
            .mockImplementation(async () => mockToken);

        await tokenController.getACSToken(req, res, () => {});

        expect(getACSUserIdSpy).toHaveBeenCalled();
        expect(createACSTokenSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockToken);
        getACSUserIdSpy.mockClear();
        createACSTokenSpy.mockClear();
    });
});