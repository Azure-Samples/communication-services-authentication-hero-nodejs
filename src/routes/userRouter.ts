/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express from 'express';
import { createACSUser, deleteACSUser, getACSUser } from '../controllers/userController';
import { validateAuthorizedHeader } from '../utils/utils';

export const userRouter = () => {
  // Initialize router
  const router = express.Router();

  // Token routes
  // 1. Get an ACS user
  router.get('/', validateAuthorizedHeader, getACSUser);
  // 2. Create an ACS user
  router.post('/', validateAuthorizedHeader, createACSUser);
  // 3. Delete an ACS user
  router.delete('/', validateAuthorizedHeader, deleteACSUser);

  return router;
};
