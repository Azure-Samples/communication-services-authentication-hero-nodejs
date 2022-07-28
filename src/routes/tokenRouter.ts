/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express from 'express';
import { exchangeAADToken, getACSToken } from '../controllers/tokenController';
import { checkJwt, checkScope } from '../utils/utils';

export const tokenRouter = () => {
  // Initialize router
  const router = express.Router();

  // Token routes
  // 1. Get an ACS token or refresh an ACS token
  router.get('/', checkJwt, checkScope, getACSToken);
  // 2. Get an ACS token for a Teams user
  router.get('/teams', checkJwt, checkScope, exchangeAADToken);

  return router;
};
