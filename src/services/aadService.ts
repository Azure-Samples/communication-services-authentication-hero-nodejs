/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Configuration, ConfidentialClientApplication } from '@azure/msal-node';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { appSettings } from '../appSettings';
import { Constants } from '../config/constants';

export const aadService = {
  /**
   * Create a confidential client application that lets users utilize the OBO workflow
   */
  createConfidentialClientApplication: (): ConfidentialClientApplication => {
    const msalConfig: Configuration = {
      auth: {
        clientId: appSettings.remoteResources.azureActiveDirectory.appRegistrations.applicationId,
        authority: `${Constants.AUTHORITY_HOST}/${appSettings.remoteResources.azureActiveDirectory.appRegistrations.tenantId}`,
        clientSecret: appSettings.remoteResources.azureActiveDirectory.appRegistrations.clientSecret
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
      scopes: [appSettings.remoteResources.azureActiveDirectory.appRegistrations.webAPIScope],
      redirectUri: appSettings.remoteResources.azureActiveDirectory.appRegistrations.redirectUri
    };

    // Get url to sign user in and consent to scopes needed for application
    const authCode = await confidentialClientApplication.getAuthCodeUrl(authCodeUrlParameters);

    // Generate the AAD token 
    const tokenRequest = {
      code: authCode,
      scopes: [appSettings.remoteResources.azureActiveDirectory.appRegistrations.webAPIScope],
      redirectUri: appSettings.remoteResources.azureActiveDirectory.appRegistrations.redirectUri
    };

    const aadTokenResponse = await confidentialClientApplication.acquireTokenByCode(tokenRequest);
    
    return aadTokenResponse.accessToken;
  }, 

  /**
   * Generate the OBO token (i.e. token B in OBO workflow)
   */
  createOBOToken: async(): Promise<string> => {
    const confidentialClientApplication = aadService.createConfidentialClientApplication();
    const aadToken = await aadService.createAADToken(confidentialClientApplication);
    
    // Generate the OBO token
    const oboRequest = {
      oboAssertion: aadToken,
      scopes: ['user.read']
    };

    const oboTokenResponse = await confidentialClientApplication.acquireTokenOnBehalfOf(oboRequest);
    
    return oboTokenResponse.accessToken;
  }

};
