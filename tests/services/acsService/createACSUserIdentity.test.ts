/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { CommunicationIdentityClient } from '@azure/communication-identity';
import * as acsService from '../../../src/services/acsService';
import { mockCommunicationUserIdentifier } from '../../utils/mockData';

const mockCommunicationIdentityClient = (
  isCreateClientResolved?: boolean,
  isCreateUserIdentityResolved?: boolean
): CommunicationIdentityClient => {
  const clientApp: any = {};
  clientApp.constructor = jest.fn().mockReturnValue(clientApp);
  clientApp.createUser = () => {
    if (!isCreateUserIdentityResolved) {
      return new Promise((resolve, reject) => reject(null));
    }
    return new Promise((resolve, reject) => resolve(mockCommunicationUserIdentifier));
  };
  return !isCreateClientResolved ? undefined : (clientApp as CommunicationIdentityClient);
};

let createAuthenticatedClientSpy: jest.SpyInstance;

describe('ACS Service - Create ACS User Identity: ', () => {
  test('when Authenticated Client fails to be created, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(false));

    let mockError: undefined | String = undefined;
    try {
      await acsService.createACSUserIdentity();
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when ACS user fails to be created, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, false));

    let mockError: undefined | String = undefined;
    let userId: string;
    try {
      userId = await acsService.createACSUserIdentity();
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when all succeeds, it should return a user id.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, true));

    let mockError: undefined | String = undefined;
    let userId: string;
    try {
      userId = await acsService.createACSUserIdentity();
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeFalsy();
    expect(userId).toBe(mockCommunicationUserIdentifier.communicationUserId);
  });
});
