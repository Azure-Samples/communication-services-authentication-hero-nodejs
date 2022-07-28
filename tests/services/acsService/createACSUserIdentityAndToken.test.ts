/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { CommunicationIdentityClient } from '@azure/communication-identity';
import * as acsService from '../../../src/services/acsService';
import { mockCommunicationUserToken } from '../../utils/mockData';

const mockCommunicationIdentityClient = (
  isCreateClientResolved?: boolean,
  isCreateUserAndTokenResolved?: boolean
): CommunicationIdentityClient => {
  const clientApp: any = {};
  clientApp.constructor = jest.fn().mockReturnValue(clientApp);
  clientApp.createUserAndToken = () => {
    if (!isCreateUserAndTokenResolved) {
      return new Promise((resolve, reject) => reject(null));
    }
    return new Promise((resolve, reject) => resolve(mockCommunicationUserToken));
  };
  return !isCreateClientResolved ? undefined : (clientApp as CommunicationIdentityClient);
};

let createAuthenticatedClientSpy: jest.SpyInstance;

describe('ACS Service - Create ACS User Identity And Token: ', () => {
  test('when Authenticated Client fails to be created, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(false));

    let mockError: undefined | String = undefined;
    try {
      await acsService.createACSUserIdentityAndToken();
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when user and token fail to be created, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, false));

    let mockError: undefined | String = undefined;
    let userToken;
    try {
      userToken = await acsService.createACSUserIdentityAndToken();
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when all succeeds, it should return a user token.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, true));

    let mockError: undefined | String = undefined;
    let userToken;
    try {
      userToken = await acsService.createACSUserIdentityAndToken();
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeFalsy();
    expect(userToken).toBe(mockCommunicationUserToken);
  });
});
