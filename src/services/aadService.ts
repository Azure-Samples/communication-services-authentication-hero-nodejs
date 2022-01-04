/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Configuration, ConfidentialClientApplication } from '@azure/msal-node';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { appSettings } from '../appSettings';
import { Constants } from '../config/constants';

// Error messages
const CREATE_AAD_TOKEN_VIA_ACG_ERROR =
  'An error occured when issuing an Azure AD token to call a Web API through Authorization Code Grant flow';
const EXCHANGE_AAD_TOKEN_VIA_OBO_ERROR =
  'An error occured when exchanging the incoming access token for another access token to call downstream APIs through On-Behalf-Of flow';

export const aadService = {
  /**
   * Create a client for communication with Azure Active Directory
   */
  createConfidentialClientApplication: (): ConfidentialClientApplication => {
    const msalConfig: Configuration = {
      auth: {
        clientId: appSettings.remoteResources.azureActiveDirectory.appRegistrations.clientId,
        authority: `${Constants.AUTHORITY_HOST}/${appSettings.remoteResources.azureActiveDirectory.appRegistrations.tenantId}`,
        clientSecret: appSettings.remoteResources.azureActiveDirectory.appRegistrations.clientSecret
      }
    };

    const confidentialClientApplication = new ConfidentialClientApplication(msalConfig);

    return confidentialClientApplication;
  },

  /**
   * Secured Web API to allow users to authenticate and obtain an access token to call Nodejs web APIs, and then
   * exchange the access token for another access token to call downstream APIs
   *
   * Step 1: Issue an Azure AD token to call Web APIs through Authorization Code Grant flow
   *
   *         1. The first sub-step (getAuthCodeUrl) is to sent a URL by the application that can be used to generate an authorization code.
   *            This URL can be opened in a browser of choice, where the user can input their credentials,
   *            and will be redirected back to the redirectUri (registered during the app registration) with an authorization code.
   *            The authorization code can now be redeemed for a token with the second step.
   *
   *         2. The second sub-step (acquireTokenByCode) is to exchange the authorization code received as a part of the above step for an access token.
   */
  createAADTokenViaACG: async (confidentialClientApplication: ConfidentialClientApplication): Promise<string> => {
    const authCodeUrlParameters = {
      scopes: [appSettings.remoteResources.azureActiveDirectory.appRegistrations.webAPIScope],
      redirectUri: appSettings.remoteResources.azureActiveDirectory.appRegistrations.redirectUri
    };
    // Generate an authorization code
    const authCode = await confidentialClientApplication.getAuthCodeUrl(authCodeUrlParameters);

    // Eexchange the authorization code for an access token
    try {
      const aadTokenRequest = {
        code: authCode,
        scopes: [appSettings.remoteResources.azureActiveDirectory.appRegistrations.webAPIScope],
        redirectUri: appSettings.remoteResources.azureActiveDirectory.appRegistrations.redirectUri
      };
      const aadTokenResponseViaACG = await confidentialClientApplication.acquireTokenByCode(aadTokenRequest);

      return aadTokenResponseViaACG.accessToken;
    } catch (error) {
      console.log(CREATE_AAD_TOKEN_VIA_ACG_ERROR);
      throw error;
    }
  },

  /**
   * Secured Web API to allow users to authenticate and obtain an access token to call Nodejs web APIs, and then
   * exchange the access token for another access token to call downstream APIs
   *
   * Step 2: Exchange an incoming access token for another access token to call downstream APIs through On-Behalf-Of flow
   */
  exchangeAADTokenViaOBO: async (aadToken: string): Promise<string> => {
    const confidentialClientApplication = aadService.createConfidentialClientApplication();

    // Exchange the incoming access token for another access token
    try {
      const oboRequest = {
        oboAssertion: aadToken,
        scopes: ['user.read']
      };
      const aadTokenResponseViaOBO = await confidentialClientApplication.acquireTokenOnBehalfOf(oboRequest);

      return aadTokenResponseViaOBO.accessToken;
    } catch (error) {
      console.log(EXCHANGE_AAD_TOKEN_VIA_OBO_ERROR);
      throw error;
    }
  }
};
