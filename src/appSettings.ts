/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { TokenScope } from '@azure/communication-identity';

export const appSettings = {
  graph: {
    extensionName: 'com.contoso.identityMapping' // The name of Graph open extension representing some roaming profile information about users, can be changed by your need
  },
  communicationServices: {
    connectionString:
      process.env['communicationServices_connectionString'] ||
      '<your_connection_string>',
    scopes: ['voip', 'chat'] as TokenScope[]
  },
  microsoftEntraID: {
    instance: 'https://login.microsoftonline.com',
      clientId: process.env['microsoftEntraID_clientId'] || '<your_client_id>', // Application (Client) ID from Overview of app registration from Azure Portal, e.g. 2ed40e05-ba00-4853-xxxx-xxx60029x596]
      clientSecret: process.env['microsoftEntraID_clientSecret'] || '<your_client_secret>', // Client secret from Overview of app registration from Azure Portal
      tenantId: process.env['microsoftEntraID_tenantId'] || '<your_tenant_id>' // Directory (Tenant) ID from Overview of app registration from Azure Portal, or 'common' or 'organizations' or 'consumers'
  }
};
