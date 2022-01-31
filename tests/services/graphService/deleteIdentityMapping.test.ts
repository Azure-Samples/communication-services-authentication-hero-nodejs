/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { Client, GraphRequest } from '@microsoft/microsoft-graph-client';
import * as graphService from '../../../src/services/graphService';
import { mockCommunicationAccessToken, mockAcsUserId } from '../../utils/mockData';

let callPath = '';
const mockGraphClient = (
  isCreateClientResolved?: boolean,
  isApiResolved?: boolean,
  isDeleteresolved?: boolean
): Client => {
  const clientApp: any = {};
  clientApp.api = () => {
    callPath += 'graphClient.api';
    if (!isApiResolved) {
      return undefined;
    }
    return mockGraphRequest(isDeleteresolved);
  };
  return !isCreateClientResolved ? undefined : (clientApp as Client);
};

const mockGraphRequest = (isDeleteresolved?: boolean): GraphRequest => {
  const requestApp: any = {};
  requestApp.delete = () => {
    callPath += '.delete';
    if (!isDeleteresolved) {
      return new Promise((resolve, reject) => reject(undefined));
    }
    return new Promise((resolve, reject) => resolve(undefined));
  };
  return requestApp as GraphRequest;
};

const mockGraphResponse = {
  acsUserIdentity: mockAcsUserId
};

let createAuthenticatedClientSpy: jest.SpyInstance;

describe('Graph Service - Delete Identity Mapping: ', () => {
  afterEach(() => {
    createAuthenticatedClientSpy.mockClear();
    callPath = '';
  });

  test('when Authenticated Client fails to be created, it should throw an error and no Graph call has been done.', async () => {
    const isCreateClientResolved = false;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() => mockGraphClient(isCreateClientResolved));

    let mockError: any = undefined;
    try {
      await graphService.deleteIdentityMapping(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBeFalsy();
    expect(mockError).toBeTruthy();
  });

  test('when Graph fails to get GraphRequest API, it should call Graph API and throw an error.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = false;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() => mockGraphClient(isCreateClientResolved, isApiResolved));

    let mockError: any = undefined;
    let acsUserIdentity;
    try {
      acsUserIdentity = await graphService.deleteIdentityMapping(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api');
    expect(mockError).toBeTruthy();
  });

  test('when Graph request fails, it should call Graph API.delete and throw an error.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = true;
    const isDeleteResolved = false;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() => mockGraphClient(isCreateClientResolved, isApiResolved, isDeleteResolved));

    let mockError: any = undefined;
    let acsUserIdentity;
    try {
      acsUserIdentity = await graphService.deleteIdentityMapping(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api.delete');
    expect(mockError).toBeTruthy();
  });

  test('when Graph request succeeds, it should call Graph API.delete and not trhow an error.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = true;
    const isDeleteResolved = true;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() => mockGraphClient(isCreateClientResolved, isApiResolved, isDeleteResolved));

    let mockError: any = undefined;
    let acsUserIdentity;
    try {
      acsUserIdentity = await graphService.deleteIdentityMapping(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api.delete');
    expect(mockError).toBeFalsy();
  });
});
