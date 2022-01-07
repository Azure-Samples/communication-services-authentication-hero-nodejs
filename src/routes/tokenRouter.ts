/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express from 'express';
import { userController } from '../controllers/userController';
// import { tokenController } from '../controllers/tokenController';

export const tokenRouter = () => {
  // Initialize router
  const router = express.Router();

  // Token routes
  // 1. Get an ACS token or refresh an ACS token
  // router.get('/token', tokenController.getACSToken);
  router.get('/token', userController.createACSUser);

  return router;
};
