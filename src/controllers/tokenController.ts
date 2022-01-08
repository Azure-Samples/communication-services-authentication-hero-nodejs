/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { acsService } from '../services/acsService';
import { aadService } from '../services/aadService';
import { graphService } from '../services/graphService';
import { IdentityMappingNotFoundError } from '../errors/identityMappingNotFoundError';

export const tokenController = {
  /**
   * Get or refresh a Communication Services access token
   *
   * 1. If the identity mapping information existing in the user's roaming profile,
   *    then issue an access token for an already existing Communication Services identity
   * 2. If not, create a Communication Services identity and then
   *    2.1 If successfully adding the identity mapping information, then issue an access token.
   *    2.2 If not, return an error message.
   *
   * If having issues when using ACS services, return an error message as well.
   */
  getACSToken: async (req: Request, res: Response, next: NextFunction) => {
    let aadToken, aadOboToken, acsToken;

    // Extract the aadToken from the authorization header
    const authHeader = req.headers.authorization;
    if (authHeader) {
      aadToken = authHeader.split(' ')[1];
    } else {
      return res.sendStatus(401);
    }

    try {
      // Retrieve the AAD token via OBO flow
      aadOboToken = await aadService.exchangeAADTokenViaOBO(aadToken);

      // User exists
      const acsUserId = await graphService.getACSUserId(aadOboToken);
      acsToken = await acsService.createACSToken(acsUserId);

      return res.status(200).json(acsToken);
    } catch (error) {
      if (error && error instanceof IdentityMappingNotFoundError) {
        // User doesn't exist
        try {
          const identityTokenResponse = await acsService.createACSUserIdentityAndToken();
          // retrieve the token, its expiry date and user object from the response
          const { token, expiresOn, user } = identityTokenResponse;
          // Store the identity mapping information
          graphService.addIdentityMapping(aadOboToken, user.communicationUserId);
          // This LoC below should be excuted after AddIdentityMapping excuted successfully
          // because the acsToken can not be returned if failing to add the identity mapping information to Microsoft Graph
          acsToken = {
            token: token,
            expiresOn: expiresOn
          };

          return res.status(200).json(acsToken);
        } catch (error) {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }
};
