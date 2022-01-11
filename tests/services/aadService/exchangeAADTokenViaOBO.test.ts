/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/jest/index.d.ts" />

import {
  Configuration,
  ConfidentialClientApplication,
  OnBehalfOfRequest
} from '@azure/msal-node';
import { mockAadToken } from '../../utils/mockData';
import { aadService } from '../../../src/services/aadService';

const mockConfidentialClientApplication = (msalConfig: Configuration): ConfidentialClientApplication => {
  const clientApp: any = {};
  clientApp.constructor = jest.fn().mockReturnValue(clientApp);
  clientApp.acquireTokenOnBehalfOf = (oboRequest: OnBehalfOfRequest) => {
    if (!!msalConfig.auth.clientId && !!oboRequest.oboAssertion) {
      return new Promise((resolve, reject) => resolve({ accessToken: mockAadToken }));
    }
    return new Promise((resolve, reject) => reject(null));
  };
  return clientApp as ConfidentialClientApplication;
};

const mockEmptyMsalConfig: Configuration = {
  auth: {
    clientId: '',
    authority: '',
    clientSecret: ''
  }
};

const mockMsalConfig: Configuration = {
  auth: {
    clientId: 'mock-client-id',
    authority: '',
    clientSecret: ''
  }
};

let createConfidentialClientApplicationSpy: jest.SpyInstance;

describe('Exchange AAD Token Via OBO: ', () => {
  test('when Confidential Client Application fails to create, it should throw an error.', async () => {
    createConfidentialClientApplicationSpy = jest
      .spyOn(aadService, 'createConfidentialClientApplication')
      .mockImplementation(() => mockConfidentialClientApplication(mockEmptyMsalConfig));

    let mockError: any = undefined;
    try {
      await aadService.exchangeAADTokenViaOBO(mockAadToken);
    } catch {
      mockError = 'error';
    }

    expect(createConfidentialClientApplicationSpy).toHaveBeenCalled();
    expect(mockError).toBeTruthy();
  });

  test('when token OnBehalfOf failed to be acquired, it should throw an error.', async () => {
    createConfidentialClientApplicationSpy = jest
      .spyOn(aadService, 'createConfidentialClientApplication')
      .mockImplementation(() => mockConfidentialClientApplication(mockMsalConfig));

    let mockError: any = undefined;
    let token: string;
    try {
      token = await aadService.exchangeAADTokenViaOBO(mockAadToken);
    } catch {
      mockError = 'error';
    }

    expect(createConfidentialClientApplicationSpy).toHaveBeenCalled();
    expect(mockError).toBeFalsy();
    expect(token).toBe(mockAadToken);
  });
});
