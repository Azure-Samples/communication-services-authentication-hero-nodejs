/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express from 'express';
import { oboController } from '../controllers/oboController';

export const oboRouter = () => {
  // Initialize router
  const router = express.Router();

  // AAD OBO routes
  // 1. Get an AAD token using OBO workflow when signing users in
  router.get('/token', oboController.getOBOToken);

  return router;
};
