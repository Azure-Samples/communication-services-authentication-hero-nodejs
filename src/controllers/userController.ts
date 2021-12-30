/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { acsService } from '../services/acsService';
import { graphService } from '../services/graphService';

export const userController = {
  /**
   * Create a Communication Services identity and then add the roaming identity mapping information to the user resource
   */
  createACSUser: async (req: Request, res: Response) => {
    const acsUserId = await acsService.createACSUserIdentity();
    try {
      const mappingResponse = await graphService.addIdentityMapping(acsUserId);
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
      const acsuserId = await graphService.getACSUserId();
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
      const acsuserId = await graphService.getACSUserId();
      // Delete the identity mapping from the user's roaming profile information using Microsoft Graph Open Extension
      graphService.deleteIdentityMapping();
      // Delete the ACS user identity which revokes all active access tokens
      // and prevents users from issuing access tokens for the identity.
      // It also removes all the persisted content associated with the identity.
      acsService.deleteACSUserIdentity(acsuserId);
      return res.status(200).json({
        message: `Successfully deleted the ACS user identity ${acsuserId} which revokes all active access tokens and removes all the persisted content, and the identity mapping`
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 500, message: error.message });
    }
  }
};
