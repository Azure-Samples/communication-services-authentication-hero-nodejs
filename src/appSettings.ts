/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { TokenScope } from '@azure/communication-identity';

export const appSettings = {
  graph: {
    extensionName: process.env['GraphExtensionName'] || '<your_extension_name>' // The name of Graph open extension representing some roaming profile information about users
  },
  communicationServices: {
    connectionString: process.env['ResourceConnectionString'] || '<your_connection_string>',
    scopes: ['voip', 'chat'] as TokenScope[] // Scopes to include in the token.
  },
  azureActiveDirectory: {
    instance: 'https://login.microsoftonline.com',
    clientId: process.env['AzureActiveDirectory_ClientId'] || '<your_client_id>', // Application (Client) ID from Overview of app registration from Azure Portal, e.g. 2ed40e05-ba00-4853-xxxx-xxx60029x596]
    clientSecret: process.env['AzureActiveDirectory_ClientSecret'] || '<your_client_secret>', // Client secret from Overview of app registration from Azure Portal
    tenantId: process.env['AzureActiveDirectory_TenantId'] || '<your_tenant_id>' // Directory (Tenant) ID from Overview of app registration from Azure Portal, or 'common' or 'organizations' or 'consumers'
  }
};
