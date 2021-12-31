/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { Constants } from '../config/constants';
import { acsService } from '../services/acsService';
import { graphService } from '../services/graphService';

export const tokenController = {
  /**
   * Get a Communication Services access token
   *
   * 1. If the identity mapping information existing in the user's roaming profile,
   *    then issue an access token for an already existing Communication Services identity
   * 2. If not, create a Communication Services identity and issue an access token first,
   *    then add the identity mapping information to the user resource using Graph open extension.
   */
  getACSToken: async (req: Request, res: Response) => {
    let acsToken;

    try {
      // User exists
      const acsUserId = await graphService.getACSUserId(Constants.ACCESS_TOKEN);
      acsToken = await acsService.createACSToken(acsUserId);
    } catch (error) {
      // User doesn't exist
      const identityTokenResponse = await acsService.createACSUserIdentityAndToken();
      // retrieve the token, its expiry date and user object from the response
      const { token, expiresOn, user } = identityTokenResponse;
      acsToken = {
        token: token,
        expiresOn: expiresOn
      };
      // Store the identity mapping information
      graphService.addIdentityMapping(Constants.ACCESS_TOKEN, user.communicationUserId).catch((error) => {
        console.log(error.message);
      });
    }

    return res.status(200).json(acsToken);
  },

  /**
   * Eexchange AAD token for an ACS access token of Teams user with the Azure Communication Services Identity SDK.
   *
   * 1. Get an AAD user access token for M365 (Teams) user via OBO flow.
   * 2. Initialize a Communication Identity Client and then issue an ACS access token for the Teams user
   */
  exchangeAADToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Todo: Get it from OBO flow
      const aadToken = '';
      // Exchange the AAD user token for the Teams access token
      const acsTokenForTeamsUser = acsService.getACSTokenForTeamsUser(aadToken);
      return res.status(200).json(acsTokenForTeamsUser);
    } catch (error) {
      next(error);
    }
  }
};
