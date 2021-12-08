/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { acsManager } from '../utils/acsManager';
import { graphManager } from '../utils/graphManager';

export const acsTokenController = {
  getACSToken: async (req: Request, res: Response): Promise<any> => {
    let acsToken;

    const acsUserId = await graphManager.getACSUserId('accessToken');

    if (acsUserId) {
      // User exists
      acsToken = await acsManager.createACSToken(acsUserId);
    } else {
      // User doesn't exist
      const identityTokenResponse = await acsManager.createACSUserIdentityAndToken();
      // retrieve the token, its expiry date and user from the response
      const { token, expiresOn, user } = identityTokenResponse;
      // Store the identity mapping info
      graphManager.addIdentityMapping('accessToken', user.communicationUserId);
      acsToken = {
        token: token,
        expiresOn: expiresOn
      };
    }

    return res.status(200).json(acsToken);
  }
};
