/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import app from './app';

const port = app.get('port');
const env = app.get('env');

// Start Express server
export const server = app.listen(port, () => {
  // Will be changed when merging
  console.log(`  ACS authentication server sample is running at http://localhost:${port} in ${env} mode`);
  console.log('  Press CTRL-C to stop\n');
});
