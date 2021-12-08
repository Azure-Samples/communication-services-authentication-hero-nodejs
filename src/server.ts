/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/
import express from 'express';

const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
