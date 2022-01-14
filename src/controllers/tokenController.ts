/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { getAADTokenViaRequest } from '../utils/utils';
import { addIdentityMapping, getACSUserId } from '../services/graphService';
import { createACSToken, createACSUserIdentityAndToken } from '../services/acsService';
import { exchangeAADTokenViaOBO } from '../services/aadService';

/**
 * Get or refresh a Communication Services access token
 *
 * 1. If the identity mapping information exists in Microsoft Graph,
 *    then issue an access token for an already existing Communication Services identity
 * 2. If not, create a Communication Services identity and then
 *    2.1 If successfully adding the identity mapping information, then issue an access token.
 *    2.2 If not, return an error message.
 *
 * If having issues when using ACS services, return an error message as well.
 */
export const getACSToken = async (req: Request, res: Response, next: NextFunction) => {
  let acsToken;
  try {
    // Get aad token via the request
    const aadTokenViaRequest = getAADTokenViaRequest(req);
    // Retrieve the AAD token via OBO flow
    const aadTokenExchangedViaOBO = await exchangeAADTokenViaOBO(aadTokenViaRequest);

    // Retrieve ACS Identity from Microsoft Graph
    const acsUserId = await getACSUserId(aadTokenExchangedViaOBO);

    if (acsUserId === undefined) {
      console.log('There is no identity mapping information stored in Graph. Creating ACS identity now...');
      // User does not exist
      const identityTokenResponse = await createACSUserIdentityAndToken();
      // retrieve the token, its expiry date and user object from the response
      const { token, expiresOn, user } = identityTokenResponse;
      // Store the identity mapping information
      await addIdentityMapping(aadTokenExchangedViaOBO, user.communicationUserId);
      // This LoC below should be excuted after AddIdentityMapping excuted successfully
      // because the acsToken can not be returned if failing to add the identity mapping information to Microsoft Graph
      acsToken = {
        token: token,
        expiresOn: expiresOn
      };
    } else {
      // User exists
      acsToken = await createACSToken(acsUserId);
    }
  } catch (error) {
    return next(error);
  }
  return res.status(200).json(acsToken);
};
