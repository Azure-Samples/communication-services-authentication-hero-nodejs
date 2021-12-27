/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { Constants } from '../config/constants';
import { acsService } from '../services/acsService';
import { graphService } from '../services/graphService';

export const tokenController = {
  /**
   * Get or refresh a Communication Services access token
   *
   * 1. If the identity mapping information existing in the user's roaming profile,
   *    then issue an access token for an already existing Communication Services identity
   * 2. If not, create a Communication Services identity and then
   *    2.1 If successfully adding the identity mapping information, then issue an access token.
   *    2.2 If not, return an error message.
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
      // Store the identity mapping information
      graphService.addIdentityMapping(Constants.ACCESS_TOKEN, user.communicationUserId).catch((error) => {
        console.log(error.message);
        return res.status(500).send({ status: 500, message: error.message });
      });
      acsToken = {
        token: token,
        expiresOn: expiresOn
      };
      
    }

    return res.status(200).json(acsToken);
  }
};
