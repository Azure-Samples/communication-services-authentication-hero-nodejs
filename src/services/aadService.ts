/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Configuration, ConfidentialClientApplication } from '@azure/msal-node';
import { appSettings } from '../appSettings';

// Error messages
const EXCHANGE_AAD_TOKEN_VIA_OBO_ERROR =
  'An error occurred when exchanging the incoming access token for another access token to call downstream APIs through On-Behalf-Of flow';

/**
 * Create a client for communication with Microsoft Entra ID
 *
 * @private
 */
export const createConfidentialClientApplication = (): ConfidentialClientApplication => {
  const msalConfig: Configuration = {
    auth: {
      clientId: appSettings.azureActiveDirectory.clientId,
      authority: `${appSettings.azureActiveDirectory.instance}/${appSettings.azureActiveDirectory.tenantId}`,
      clientSecret: appSettings.azureActiveDirectory.clientSecret
    }
  };
  const confidentialClientApplication = new ConfidentialClientApplication(msalConfig);
  return confidentialClientApplication;
};

/**
 * Secured Web API which allows users to exchange the incoming access token for another access token to call downstream APIs
 *
 * Exchange an incoming access token for another access token to call downstream APIs through On-Behalf-Of flow.
 *
 * Notice: The incoming access token is generated by the client.
 */
export const exchangeAADTokenViaOBO = async (aadToken: string): Promise<string> => {
  const confidentialClientApplication = createConfidentialClientApplication();
  // Exchange the incoming access token for another access token
  try {
    const oboRequest = {
      oboAssertion: aadToken, // The access token that was sent to the middle-tier API. This token must have an audience of the app making this OBO request.
      scopes: ['user.read'] // Array of scopes the application is requesting access to.
    };
    const aadTokenResponseViaOBO = await confidentialClientApplication.acquireTokenOnBehalfOf(oboRequest);
    return aadTokenResponseViaOBO.accessToken;
  } catch (error) {
    console.log(EXCHANGE_AAD_TOKEN_VIA_OBO_ERROR);
    throw error;
  }
};
