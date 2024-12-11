/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { createErrorResponse, getAADTokenViaRequest } from '../utils/utils';
import { getACSUserId } from '../services/graphService';
import { createACSToken, getACSTokenForTeamsUser } from '../services/acsService';
import { exchangeAADTokenViaOBO } from '../services/aadService';
import { AuthenticatedRequest } from 'src/types/authenticatedRequest';

const ACS_IDENTITY_NOT_FOUND_ERROR = 'Can not find any ACS identities in Microsoft Graph used to create an ACS token';

/**
 * Get or refresh a Communication Services access token
 *
 * 1. If the identity mapping information exists in Microsoft Graph,
 *    then issue an access token for an already existing Communication Services identity
 * 2. If not, return an error message.
 *
 * If having issues when using ACS services, return an error message as well.
 */
export const getACSToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get Microsoft Entra token via the request
    const aadTokenViaRequest = getAADTokenViaRequest(req);
    // Retrieve the Microsoft Entra token via OBO flow
    const aadTokenExchangedViaOBO = await exchangeAADTokenViaOBO(aadTokenViaRequest);

    // Retrieve ACS Identity from Microsoft Graph
    const acsUserId = await getACSUserId(aadTokenExchangedViaOBO);

    if (acsUserId !== undefined) {
      // The ACS user exists
      const acsToken = await createACSToken(acsUserId);
      const acsIdentityTokenObject = {
        ...acsToken,
        user: { communicationUserId: acsUserId }
      };

      return res.status(201).json(acsIdentityTokenObject);
    } else {
      // The ACS user does not exist
      return res.status(404).json(createErrorResponse(404, ACS_IDENTITY_NOT_FOUND_ERROR));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * Exchange Microsoft Entra token of a Teams user for an ACS access token using the Azure Communication Services Identity SDK.
 *
 * 1. Get an Microsoft Entra token with Teams.ManageCalls and Teams.ManageChats delegated permissions passed through the 'teams-user-Microsoft Entra-token' header
 * 2. Get Microsoft Entra user object ID obtained from the oid claim of the token received in the Authorization header
 * 3. Initialize a Communication Identity Client and then issue an ACS access token for the Teams user
 */
export const exchangeAADToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get an Microsoft Entra token passed through the 'teams-user-Microsoft Entra-token' header
    const teamsUserAadToken = req.headers['teams-user-aad-token'] as string;
    // Get the oid claim of the token received in the Authorization header
    const userObjectId = req.user.oid;
    // Exchange the Microsoft Entra user token for the Teams access token
    const acsTokenForTeamsUser = await getACSTokenForTeamsUser(teamsUserAadToken, userObjectId);
    return res.status(201).json(acsTokenForTeamsUser);
  } catch (error) {
    next(error);
  }
};
