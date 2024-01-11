/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import { Configuration, ConfidentialClientApplication, OnBehalfOfRequest } from '@azure/msal-node';
import { mockMeidToken } from '../../utils/mockData';
import * as meidService from '../../../src/services/aadService';

const mockConfidentialClientApplication = (
  msalConfig?: Configuration,
  isOboResolved?: boolean
): ConfidentialClientApplication => {
  const clientApp: any = {};
  clientApp.constructor = jest.fn().mockReturnValue(clientApp);
  clientApp.acquireTokenOnBehalfOf = (oboRequest: OnBehalfOfRequest) => {
    if (!oboRequest.oboAssertion || !isOboResolved) {
      return new Promise((resolve, reject) => reject(null));
    }
    return new Promise((resolve, reject) => resolve({ accessToken: mockMeidToken }));
  };
  return !msalConfig ? undefined : (clientApp as ConfidentialClientApplication);
};

const mockMsalConfig: Configuration = {
  auth: {
    clientId: '',
    authority: '',
    clientSecret: ''
  }
};

let createConfidentialClientApplicationSpy: jest.SpyInstance;

describe('Microsoft Entra ID Service - Exchange Microsoft Entra Token Via OBO: ', () => {
  test('when Confidential Client Application fails to be created, it should throw an error.', async () => {
    createConfidentialClientApplicationSpy = jest
      .spyOn(aadService, 'createConfidentialClientApplication')
      .mockImplementation(() => mockConfidentialClientApplication());

    let mockError: undefined | String = undefined;
    try {
      await meidService.exchangeMEIDTokenViaOBO(mockMeidToken);
    } catch {
      mockError = 'error';
    }

    expect(createConfidentialClientApplicationSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
    createConfidentialClientApplicationSpy.mockClear();
  });

  test('when OBO token failed to be acquired, it should throw an error.', async () => {
    createConfidentialClientApplicationSpy = jest
      .spyOn(meidService, 'createConfidentialClientApplication')
      .mockImplementation(() => mockConfidentialClientApplication(mockMsalConfig));

    let mockError: undefined | String = undefined;
    let token: string;
    try {
      token = await meidService.exchangeMEIDTokenViaOBO(mockMeidToken);
    } catch {
      mockError = 'error';
    }

    expect(createConfidentialClientApplicationSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
    createConfidentialClientApplicationSpy.mockClear();
  });

  test('when all succeeds, it should return mock token.', async () => {
    createConfidentialClientApplicationSpy = jest
      .spyOn(meidService, 'createConfidentialClientApplication')
      .mockImplementation(() => mockConfidentialClientApplication(mockMsalConfig, true));

    let mockError: undefined | String = undefined;
    let token: string = '';
    try {
      token = await meidService.exchangeMEIDTokenViaOBO(mockMeidToken);
    } catch {
      mockError = 'error';
    }

    expect(createConfidentialClientApplicationSpy).toHaveBeenCalled();
    expect(mockError).toBeFalsy();
    expect(token).toBe(mockMeidToken);
    createConfidentialClientApplicationSpy.mockClear();
  });
});
