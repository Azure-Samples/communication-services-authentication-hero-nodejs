/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { aadManager } from '../services/aadService';
import { appSettings } from '../appSettings';

// Create a client for communication with Azure Active Directory
const credentialClientApplication = aadManager.createConfidentialClientApplication();

// Configuration parameters
const REDIRECT_URI = 'http://localhost:3000/redirect';
const WEB_API_SCOPE = appSettings.remoteResources.azureActiveDirectory.appRegistrations.webAPIScope;

// Error messgages
const GET_TOKEN_A_ERROR = 'An error occured when signing user in';
const GET_TOKEN_B_ERROR = 'An error occured during the On Behalf Of workflow';

export const oboController = {
  /**
   * Get a Azure Active Directory token with On Behalf Of workflow
   *
   * 1. The user tries to sign in first, a token A will be generated
   *
   * 2. With using token A as a input of OBO workflow, a token B will be
   * returned as the final token accessing the graph API
   */

  getOBOToken: async (req: Request, res: Response) => {
    let aadToken, oboToken;

    const authCodeUrlParameters = {
      scopes: [WEB_API_SCOPE],
      redirectUri: REDIRECT_URI
    };

    let code;
    try {
      // Get url to sign user in and consent to scopes needed for application
      code = await credentialClientApplication.getAuthCodeUrl(authCodeUrlParameters);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error });
    }

    // Generate token A
    try {
      const tokenRequest = {
        code: code,
        scopes: [WEB_API_SCOPE],
        redirectUri: REDIRECT_URI
      };

      const aadTokenResponse = await credentialClientApplication.acquireTokenByCode(tokenRequest);
      aadToken = aadTokenResponse.accessToken;
    } catch (error) {
      console.log(GET_TOKEN_A_ERROR + error.message);
      return res.status(500).json({ error: error });
    }

    // Generate token B, calling web api
    try {
      const oboRequest = {
        oboAssertion: aadToken,
        scopes: ['user.read']
      };

      const oboTokenResponse = await credentialClientApplication.acquireTokenOnBehalfOf(oboRequest);
      oboToken = oboTokenResponse.accessToken;
    } catch (error) {
      console.log(GET_TOKEN_B_ERROR + error.message);
      return res.status(500).json({ error: error });
    }

    return res.status(200).json(oboToken);
  }
};
