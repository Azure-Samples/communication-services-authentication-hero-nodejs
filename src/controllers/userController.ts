/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { createErrorResponse, getAADTokenViaRequest } from '../utils/utils';
import { exchangeAADTokenViaOBO } from '../services/aadService';
import { createACSUserIdentity, deleteACSUserIdentity } from '../services/acsService';
import { addIdentityMapping, deleteIdentityMapping, getACSUserId } from '../services/graphService';

const NO_IDENTITY_MAPPING_INFO_ERROR = 'There is no identity mapping information stored in Microsoft Graph';

/**
 * Create a Communication Services identity and then add the roaming identity mapping information to the user resource
 */
export const createACSUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get Microsoft Entra token via the request
    const aadTokenViaRequest = getAADTokenViaRequest(req);
    // Retrieve the Microsoft Entra token via OBO flow
    const aadTokenExchangedViaOBO = await exchangeAADTokenViaOBO(aadTokenViaRequest);
    // Get an ACS user id from Microsoft Graph
    let acsUserId = await getACSUserId(aadTokenExchangedViaOBO);

    if (acsUserId === undefined) {
      // Create a Communication Services identity.
      acsUserId = await createACSUserIdentity();
      const identityMappingResponse = await addIdentityMapping(aadTokenExchangedViaOBO, acsUserId);
      return res.status(201).json(identityMappingResponse);
    }

    return res.status(200).json({ acsUserIdentity: acsUserId });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get a Communication Services identity through Graph open extensions
 */
export const getACSUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get Microsoft Entra token via the request
    const aadTokenViaRequest = getAADTokenViaRequest(req);
    // Retrieve the Microsoft Entra token via OBO flow
    const aadTokenExchangedViaOBO = await exchangeAADTokenViaOBO(aadTokenViaRequest);
    // Get an ACS user id from Microsoft Graph
    const acsUserId = await getACSUserId(aadTokenExchangedViaOBO);

    return acsUserId === undefined
      ? res.status(404).json(createErrorResponse(404, NO_IDENTITY_MAPPING_INFO_ERROR))
      : res.status(200).json({ acsUserIdentity: acsUserId });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete a Communication Services identity and then remove an identity mapping from the user's roaming profile information
 *
 * The strategy of deleting users applied here can avoid creating an ACS token using the ACS identity already deleted which
 * will cause the error (Provided identity doesn't exist)
 *
 * Step 1: Delete the identity mapping information from Microsoft Graph
 * Step 2: Delete the ACS user identity
 *
 */
export const deleteACSUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get Microsoft Entra token via the request
    const aadTokenViaRequest = getAADTokenViaRequest(req);
    // Retrieve the Microsoft Entra token via OBO flow
    const aadTokenExchangedViaOBO = await exchangeAADTokenViaOBO(aadTokenViaRequest);
    // Get an ACS user id from Microsoft Graph
    const acsUserId = await getACSUserId(aadTokenExchangedViaOBO);

    // Delete the identity mapping from the user's roaming profile information using Microsoft Graph Open Extension
    await deleteIdentityMapping(aadTokenExchangedViaOBO);
    // Delete the ACS user identity which revokes all active access tokens
    // and prevents users from issuing access tokens for the identity.
    // It also removes all the persisted content associated with the identity.
    await deleteACSUserIdentity(acsUserId);

    return res.status(204).json();
  } catch (error) {
    return next(error);
  }
};
