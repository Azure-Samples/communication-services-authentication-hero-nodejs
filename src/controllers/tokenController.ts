/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { acsManager } from '../utils/acsManager';
import { graphManager } from '../utils/graphManager';

export const acsTokenController = {
  /**
   * Get a Communication Services access token
   * 1. If the identity mapping information existing in the user's roaming profile,
   *    then issue an access token for an already existing Communication Services identity
   * 2. If not, create a Communication Services identity and issue an access token first,
   *    then add the identity mapping information to the user resource using Graph open extensions.
   */
  getACSToken: async (req: Request, res: Response) => {
    let acsToken;

    try {
      const acsUserId = await graphManager.getACSUserId('accessToken');

      if (acsUserId) {
        // User exists
        acsToken = await acsManager.createACSToken(acsUserId);
      } else {
        // User doesn't exist
        const identityTokenResponse = await acsManager.createACSUserIdentityAndToken();
        // retrieve the token, its expiry date and user object from the response
        const { token, expiresOn, user } = identityTokenResponse;
        acsToken = {
          token: token,
          expiresOn: expiresOn
        };
        // Store the identity mapping information
        graphManager.addIdentityMapping('accessToken', user.communicationUserId);
      }

      return res.status(200).json(acsToken);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ errorMessage: error });
    }
  }
};
