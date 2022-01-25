/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { getAADTokenViaRequest } from '../utils/utils';
import { addIdentityMapping, getACSUserId } from '../services/graphService';
import { createACSToken, createACSUserIdentityAndToken, getACSTokenForTeamsUser } from '../services/acsService';
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
  let acsIdentityTokenObject;

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
      acsIdentityTokenObject = await createACSUserIdentityAndToken();
      // Store the identity mapping information
      await addIdentityMapping(aadTokenExchangedViaOBO, acsIdentityTokenObject.user.communicationUserId);
    } else {
      // User exists
      const acsToken = await createACSToken(acsUserId);
      acsIdentityTokenObject = {
        ...acsToken,
        user: { communicationUserId: acsUserId }
      };
    }
  } catch (error) {
    return next(error);
  }

  return res.status(201).json(acsIdentityTokenObject);
};

/**
 * Eexchange AAD token for an ACS access token of Teams user using the Azure Communication Services Identity SDK.
 *
 * 1. Get an AAD user access token passed through request header
 * 2. Initialize a Communication Identity Client and then issue an ACS access token for the Teams user
 */
export const exchangeAADToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get an AAD token passed through request header
    const aadTokenViaRequest = getAADTokenViaRequest(req);
    // Exchange the AAD user token for the Teams access token
    const acsTokenForTeamsUser = await getACSTokenForTeamsUser(aadTokenViaRequest);
    return res.status(201).json(acsTokenForTeamsUser);
  } catch (error) {
    next(error);
  }
};
