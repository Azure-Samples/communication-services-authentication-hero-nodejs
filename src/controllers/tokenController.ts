/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import * as acsService from '../services/acsService';
import * as aadService from '../services/aadService';
import * as graphService from '../services/graphService';
import * as utils from '../utils/utils';

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
    const aadTokenViaRequest = utils.getAADTokenViaRequest(req);
    // Retrieve the AAD token via OBO flow
    const aadTokenExchangedViaOBO = await aadService.exchangeAADTokenViaOBO(aadTokenViaRequest);
    // Retrieve ACS Identity from Microsoft Graph
    const acsUserId = await graphService.getACSUserId(aadTokenExchangedViaOBO);
    if (acsUserId === undefined) {
      console.log('There is no identity mapping information stored in Graph. Creating ACS identity now...');
      // User does not exist
      const identityTokenResponse = await acsService.createACSUserIdentityAndToken();
      // retrieve the token, its expiry date and user object from the response
      const { token, expiresOn, user } = identityTokenResponse;
      // Store the identity mapping information
      await graphService.addIdentityMapping(aadTokenExchangedViaOBO, user.communicationUserId);
      // This LoC below should be excuted after AddIdentityMapping excuted successfully
      // because the acsToken can not be returned if failing to add the identity mapping information to Microsoft Graph
      acsToken = {
        token: token,
        expiresOn: expiresOn
      };
    } else {
      // User exists
      acsToken = await acsService.createACSToken(acsUserId);
    }
  } catch (error) {
    return next(error);
  }
  return res.status(200).json(acsToken);
};
