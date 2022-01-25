/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { Client, GraphRequest } from '@microsoft/microsoft-graph-client';
import * as appSettings from '../../../src/appSettings.json';
import * as graphService from '../../../src/services/graphService';
import { mockCommunicationAccessToken, mockAcsUserId } from '../../utils/mockData';

let callPath = '';
const mockGraphClient = (
  isCreateClientResolved?: boolean,
  isApiResolved?: boolean,
  isExpandResolved?: boolean,
  isSelectResolved?: boolean,
  isGetResolved?: boolean,
  graphResponse?: any
): Client => {
  const clientApp: any = {};
  clientApp.api = () => {
    callPath += 'graphClient.api';
    if (!isApiResolved) {
      return undefined;
    }
    return mockGraphRequest(isExpandResolved, isSelectResolved, isGetResolved, graphResponse);
  };
  return !isCreateClientResolved ? undefined : (clientApp as Client);
};

const mockGraphRequest = (
  isExpandResolved?: boolean,
  isSelectResolved?: boolean,
  isGetResolved?: boolean,
  graphResponse?: any
): GraphRequest => {
  const requestApp: any = {};
  requestApp.expand = () => {
    callPath += '.expand';
    if (!isExpandResolved) {
      return undefined;
    }
    return requestApp;
  };
  requestApp.select = () => {
    callPath += '.select';
    if (!isSelectResolved) {
      return undefined;
    }
    return requestApp;
  };
  requestApp.get = () => {
    callPath += '.get';
    if (!isGetResolved) {
      return new Promise((resolve, reject) => reject(undefined));
    }
    return new Promise((resolve, reject) => resolve(graphResponse));
  };
  return requestApp as GraphRequest;
};

const mockGraphResponseWithoutAppExtension = {
  extensions: [
    {
      extensionName: 'mock-extension',
      acsUserIdentity: mockAcsUserId
    }
  ]
};

const mockGraphResponseWithAppExtension = {
  extensions: [
    {
      extensionName: appSettings.graph.extensionName,
      acsUserIdentity: mockAcsUserId
    }
  ]
};

let createAuthenticatedClientSpy: jest.SpyInstance;

describe('Graph Service - Get ACS User Id: ', () => {
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
      await graphService.getACSUserId(mockCommunicationAccessToken.token);
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
    let userId: string;
    try {
      userId = await graphService.getACSUserId(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api');
    expect(mockError).toBeTruthy();
  });

  test('when Graph request fails to expand, it should call Graph API.expand and throw an error.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = true;
    const isExpandResolved = false;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() => mockGraphClient(isCreateClientResolved, isApiResolved, isExpandResolved));

    let mockError: any = undefined;
    let userId: string;
    try {
      userId = await graphService.getACSUserId(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api.expand');
    expect(mockError).toBeTruthy();
  });

  test('when Graph request fails to select an id, it should call Graph API.expand.select and throw an error.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = true;
    const isExpandResolved = true;
    const isSelectResolved = false;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() =>
        mockGraphClient(isCreateClientResolved, isApiResolved, isExpandResolved, isSelectResolved)
      );

    let mockError: any = undefined;
    let userId: string;
    try {
      userId = await graphService.getACSUserId(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api.expand.select');
    expect(mockError).toBeTruthy();
  });

  test('when Graph request fails to be retrieved, it should call Graph API.expand.select.get and throw an error.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = true;
    const isExpandResolved = true;
    const isSelectResolved = true;
    const isGetResolved = false;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() =>
        mockGraphClient(isCreateClientResolved, isApiResolved, isExpandResolved, isSelectResolved, isGetResolved)
      );

    let mockError: any = undefined;
    let userId: string;
    try {
      userId = await graphService.getACSUserId(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api.expand.select.get');
    expect(mockError).toBeTruthy();
  });

  test('when Graph extension does not contain your app extension, it should return undefined.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = true;
    const isExpandResolved = true;
    const isSelectResolved = true;
    const isGetResolved = true;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() =>
        mockGraphClient(
          isCreateClientResolved,
          isApiResolved,
          isExpandResolved,
          isSelectResolved,
          isGetResolved,
          mockGraphResponseWithoutAppExtension
        )
      );

    let mockError: any = undefined;
    let userId: string;
    try {
      userId = await graphService.getACSUserId(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api.expand.select.get');
    expect(userId).toBeFalsy();
    expect(mockError).toBeFalsy();
  });

  test('when Graph extension does contain your app extension, it should an ACS user id.', async () => {
    const isCreateClientResolved = true;
    const isApiResolved = true;
    const isExpandResolved = true;
    const isSelectResolved = true;
    const isGetResolved = true;
    createAuthenticatedClientSpy = jest
      .spyOn(graphService, 'createAuthenticatedClient')
      .mockImplementation(() =>
        mockGraphClient(
          isCreateClientResolved,
          isApiResolved,
          isExpandResolved,
          isSelectResolved,
          isGetResolved,
          mockGraphResponseWithAppExtension
        )
      );

    let mockError: any = undefined;
    let userId: string;
    try {
      userId = await graphService.getACSUserId(mockCommunicationAccessToken.token);
    } catch {
      mockError = 'error';
    }

    expect(createAuthenticatedClientSpy).toHaveBeenCalled();
    expect(callPath).toBe('graphClient.api.expand.select.get');
    expect(userId).toBe(mockAcsUserId);
    expect(mockError).toBeFalsy();
  });
});
