/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express from 'express';
import { tokenController } from '../controllers/tokenController';

export const tokenRouter = () => {
  // Initialize router
  const router = express.Router();

  // Token routes
  // 1. Get an ACS token or refresh an ACS token
  router.get('/token', tokenController.getACSToken);

  return router;
};
