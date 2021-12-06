/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { acsManager } from '../utils/acsManager';
import { graphManager } from '../utils/graphManager';

export const acsTokenController = {
  getACSToken: async (req: Request, res: Response) => {
    // User exists
    const acsUserId = await graphManager.getACSUserId('', '');
    const acsToken = await acsManager.createACSToken(acsUserId);
    // User doesn't exist
    return res.status(200).json(acsToken);
  }
};
