/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Configuration, ConfidentialClientApplication } from '@azure/msal-node';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { appSettings } from '../appSettings';

// Error messages
const CREATE_AAD_TOKEN_ERROR = 'An error occured when creating an AAD token during user signing in';
const CREATE_OBO_TOKEN_ERROR = 'An error occured when creating the OBO token with the previous AAD token';

export const aadService = {
  /**
   * Create a confidential client application that lets users utilize the OBO workflow
   */
  createConfidentialClientApplication: (): ConfidentialClientApplication => {
    const msalConfig: Configuration = {
      auth: {
        clientId: appSettings.azureActiveDirectory.clientId,
        authority: `${appSettings.azureActiveDirectory.instance}/${appSettings.azureActiveDirectory.tenantId}`,
        clientSecret: appSettings.azureActiveDirectory.clientSecret
      }
    };

    const confidentialClientApplication = new ConfidentialClientApplication(msalConfig);

    return confidentialClientApplication;
  },

  /**
   * Generate the AAD token (i.e. token A in OBO workflow)
   */
  createAADToken: async (confidentialClientApplication: ConfidentialClientApplication): Promise<string> => {
    const authCodeUrlParameters = {
      scopes: [appSettings.azureActiveDirectory.webAPI],
      redirectUri: appSettings.azureActiveDirectory.redirectUri
    };
    // Get url to sign user in and consent to scopes needed for application
    const authCode = await confidentialClientApplication.getAuthCodeUrl(authCodeUrlParameters);

    // Generate the AAD token
    try {
      const tokenRequest = {
        code: authCode,
        scopes: [appSettings.azureActiveDirectory.webAPI],
        redirectUri: appSettings.azureActiveDirectory.redirectUri
      };
      const aadTokenResponse = await confidentialClientApplication.acquireTokenByCode(tokenRequest);

      return aadTokenResponse.accessToken;
    } catch (error) {
      console.log(CREATE_AAD_TOKEN_ERROR);
      throw error;
    }
  },

  /**
   * Generate the OBO token (i.e. token B in OBO workflow)
   */
  createOBOToken: async (): Promise<string> => {
    const confidentialClientApplication = aadService.createConfidentialClientApplication();
    const aadToken = await aadService.createAADToken(confidentialClientApplication);

    // Generate the OBO token
    try {
      const oboRequest = {
        oboAssertion: aadToken,
        scopes: ['user.read']
      };
      const oboTokenResponse = await confidentialClientApplication.acquireTokenOnBehalfOf(oboRequest);

      return oboTokenResponse.accessToken;
    } catch (error) {
      console.log(CREATE_OBO_TOKEN_ERROR);
      throw error;
    }
  }
};
