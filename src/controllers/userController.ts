/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { Constants } from '../config/constants';
import { acsManager } from '../services/acsManager';
import { graphManager } from '../services/graphManager';

export const acsUserController = {
  /**
   * Create a Communication Services identity and then add the roaming identity mapping information to the user resource
   */
  createACSUser: async (req: Request, res: Response) => {
    const acsUserId = await acsManager.createACSUserIdentity();
    try {
      const mappingResponse = await graphManager.addIdentityMapping(Constants.ACCESS_TOKEN, acsUserId);
      return res.status(200).json(mappingResponse);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 500, message: error.message });
    }
  },

  /**
   * Get a Communication Services identity through Graph open extensions
   */
  getACSUser: async (req: Request, res: Response) => {
    try {
      const acsuserId = await graphManager.getACSUserId(Constants.ACCESS_TOKEN);
      return res.status(200).json({ acsUserId: acsuserId });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 500, message: error.message });
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
  deleteACSUser: async (req: Request, res: Response) => {
    try {
      const acsuserId = await graphManager.getACSUserId(Constants.ACCESS_TOKEN);
      // Delete the identity mapping from the user's roaming profile information using Microsoft Graph Open Extension
      graphManager.deleteIdentityMapping(Constants.ACCESS_TOKEN);
      // Delete the ACS user identity which revokes all active access tokens
      // and prevents users from issuing access tokens for the identity.
      // It also removes all the persisted content associated with the identity.
      acsManager.deleteACSUserIdentity(acsuserId);
      return res.status(200).json({
        message: `Successfully deleted the ACS user identity ${acsuserId} which revokes all active access tokens and removes all the persisted content, and the identity mapping`
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 500, message: error.message });
    }
  }
};
