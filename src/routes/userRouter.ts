/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express from 'express';
import * as userController from '../controllers/userController';

export const userRouter = () => {
  // Initialize router
  const router = express.Router();

  // Token routes
  // 1. Get an ACS user
  router.get('/user', userController.getACSUser);
  // 2. Create an ACS user
  router.post('/user', userController.createACSUser);
  // 3. Delete an ACS user
  router.delete('/user', userController.deleteACSUser);

  return router;
};
