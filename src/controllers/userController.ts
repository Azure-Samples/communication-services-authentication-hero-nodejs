/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { acsManager } from '../utils/acsManager';
import { graphManager } from '../utils/graphManager';

export const acsUserController = {
  createACSUser: async (req: Request, res: Response) => {
    const acsUserId = await acsManager.createACSUserIdentity();
    const mappingResponse = await graphManager.addIdentityMapping('accessToken', acsUserId);
    return res.status(200).json(mappingResponse);
  },

  getACSUser: async (req: Request, res: Response) => {
    const acsuserId = await graphManager.getACSUserId('accessToken');
    return res.status(200).json({ acsUserId: acsuserId });
  },

  deleteACSUser: async (req: Request, res: Response): Promise<void> => {
    const acsuserId = await graphManager.getACSUserId('accessToken');
    // Delete the ACS user identity which revokes all active access tokens
    // and prevents users from issuing access tokens for the identity.
    // It also removes all the persisted content associated with the identity.
    acsManager.deleteACSUserIdentity(acsuserId);
    // Delete the identity mapping from the user's roaming profile information using Microsoft Graph Open Extension
    graphManager.deleteIdentityMapping('accessToken');
  }
};
