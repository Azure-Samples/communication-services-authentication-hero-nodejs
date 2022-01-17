/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { CommunicationIdentityClient } from '@azure/communication-identity';
import * as acsService from '../../../src/services/acsService';
import { mockAcsUserId } from '../../utils/mockData';

const mockCommunicationIdentityClient = (
  isCreateClientResolved?: boolean,
  isDeleteUserResolved?: boolean
): CommunicationIdentityClient => {
  const clientApp: any = {};
  clientApp.constructor = jest.fn().mockReturnValue(clientApp);
  clientApp.deleteUser = () => {
    if (!isDeleteUserResolved) {
      return new Promise<void>((resolve, reject) => reject());
    }
    return new Promise<void>((resolve, reject) => resolve());
  };
  return !isCreateClientResolved ? undefined : (clientApp as CommunicationIdentityClient);
};

let createAuthenticatedClientSpy: jest.SpyInstance;

describe('Delete ACS User Identity: ', () => {
  test('when Authenticated Client fails to be created, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(false));

    let mockError = undefined;
    try {
      await acsService.deleteACSUserIdentity(mockAcsUserId);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when user fails to be deleted, it should throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, false));

    let mockError = undefined;
    try {
      await acsService.deleteACSUserIdentity(mockAcsUserId);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when all succeeds, it should not throw an error.', async () => {
    createAuthenticatedClientSpy = jest
      .spyOn(acsService, 'createAuthenticatedClient')
      .mockImplementation(() => mockCommunicationIdentityClient(true, true));

    let mockError = undefined;
    try {
      await acsService.deleteACSUserIdentity(mockAcsUserId);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(mockError).toBeFalsy();
  });
});
