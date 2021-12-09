/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { acsManager } from '../utils/acsManager';
import { graphManager } from '../utils/graphManager';

export const acsUserController = {
  /**
   * Create a Communication Services identity and then add the roaming identity mapping information to the user resource
   */
  createACSUser: async (req: Request, res: Response) => {
    const acsUserId = await acsManager.createACSUserIdentity();
    try {
      const mappingResponse = await graphManager.addIdentityMapping('accessToken', acsUserId);
      return res.status(200).json(mappingResponse);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ errorMessage: error });
    }
  },

  /**
   * Get a Communication Services identity through Graph open extensions
   */
  getACSUser: async (req: Request, res: Response) => {
    try {
      const acsuserId = await graphManager.getACSUserId('accessToken');
      return res.status(200).json({ acsUserId: acsuserId });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ errorMessage: error });
    }
  },

  /**
   * Delete a Communication Services identity and then remove an identity mapping from the user's roaming profile information
   */
  deleteACSUser: async (req: Request, res: Response) => {
    try {
      const acsuserId = await graphManager.getACSUserId('accessToken');
      // Delete the ACS user identity which revokes all active access tokens
      // and prevents users from issuing access tokens for the identity.
      // It also removes all the persisted content associated with the identity.
      acsManager.deleteACSUserIdentity(acsuserId);
      // Delete the identity mapping from the user's roaming profile information using Microsoft Graph Open Extension
      graphManager.deleteIdentityMapping('accessToken');
      return res.status(200).json({
        message: `Successfully deleted the ACS user identity ${acsuserId} which revokes all active access tokens and removes all the persisted content, and the identity mapping`
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ errorMessage: error });
    }
  }
};
