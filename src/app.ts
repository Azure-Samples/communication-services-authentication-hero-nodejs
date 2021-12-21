/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import createError from 'http-errors';
import express from 'express';

// Routes
import { tokenRouter } from './routes/tokenRouter';
import { userRouter } from './routes/userRouter';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Api routes
app.use('/api/', userRouter());
app.use('/api/', tokenRouter());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
