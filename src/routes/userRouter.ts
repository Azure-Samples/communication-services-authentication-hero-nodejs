/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import express from 'express';
import { acsUserController } from '../controllers/userController';

export const userRouter = () => {
  // Initialize router
  const router = express.Router();

  // Token routes
  // 1. Get an ACS user
  router.get('/user', acsUserController.getACSUser);
  // 2. Create an ACS user
  router.post('/user', acsUserController.createACSUser);
  // 3. Delete an ACS user
  router.delete('/user', acsUserController.deleteACSUser);

  return router;
};
