/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { NextFunction, Request, Response } from 'express';
import { utils } from '../utils/utils';
import { acsService } from '../services/acsService';
import { graphService } from '../services/graphService';
import { aadService } from '../services/aadService';

export const userController = {
  /**
   * Create a Communication Services identity and then add the roaming identity mapping information to the user resource
   */
  createACSUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create a Communication Services identity.
      const acsUserId = await acsService.createACSUserIdentity();
      // Get aad token via the request
      const aadTokenViaRequest = utils.getAADTokenViaRequest(req);
      // Retrieve the AAD token via OBO flow
      const aadTokenExchangedViaOBO = await aadService.exchangeAADTokenViaOBO(aadTokenViaRequest);
      const identityMappingResponse = await graphService.addIdentityMapping(aadTokenExchangedViaOBO, acsUserId);
      return res.status(200).json(identityMappingResponse);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get a Communication Services identity through Graph open extensions
   */
  getACSUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get aad token via the request
      const aadTokenViaRequest = utils.getAADTokenViaRequest(req);
      // Retrieve the AAD token via OBO flow
      const aadTokenExchangedViaOBO = await aadService.exchangeAADTokenViaOBO(aadTokenViaRequest);
      const acsuserId = await graphService.getACSUserId(aadTokenExchangedViaOBO);
      return acsuserId === undefined
        ? res.status(200).json({ message: 'There is no identity mapping information stored in Microsoft Graph' })
        : res.status(200).json({ acsUserIdentity: acsuserId });
    } catch (error) {
      return next(error);
    }
  },

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
  deleteACSUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      /// Get aad token via the request
      const aadTokenViaRequest = utils.getAADTokenViaRequest(req);
      // Retrieve the AAD token via OBO flow
      const aadTokenExchangedViaOBO = await aadService.exchangeAADTokenViaOBO(aadTokenViaRequest);
      const acsUserId = await graphService.getACSUserId(aadTokenExchangedViaOBO);
      // Delete the identity mapping from the user's roaming profile information using Microsoft Graph Open Extension
      await graphService.deleteIdentityMapping(aadTokenExchangedViaOBO);
      // Delete the ACS user identity which revokes all active access tokens
      // and prevents users from issuing access tokens for the identity.
      // It also removes all the persisted content associated with the identity.
      await acsService.deleteACSUserIdentity(acsUserId);

      return res.status(200).json({
        message: `Successfully deleted the ACS user identity ${acsUserId} which revokes all active access tokens and removes all the persisted content, and the identity mapping`
      });
    } catch (error) {
      return next(error);
    }
  }
};
