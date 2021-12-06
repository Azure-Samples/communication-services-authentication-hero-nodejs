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
    const mappingResponse = await graphManager.addIdentityMapping('', '', '');
    return res.status(200).json(mappingResponse);
  },

  getACSUser: async (req: Request, res: Response) => {
    const acsuserId = await graphManager.getACSUserId('', '');
    return res.status(200).json({ acsUserId: acsuserId });
  },

  deleteACSUser: async (req: Request, res: Response) => {}
};
