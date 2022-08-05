/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { LogLevel } from '@azure/msal-browser';

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: '<your_client_id>', // Application (Client) ID from Overview of app registration from Azure Portal, e.g. 2ed40e05-ba00-4853-xxxx-xxx60029x596]
    authority: 'https://login.microsoftonline.com/<your_tenant_id>', // Directory (Tenant) ID from Overview of app registration from Azure Portal, or 'common' or 'organizations' or 'consumers'
    redirectUri: 'http://localhost:3000/'
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      }
    }
  }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [`api://${msalConfig.auth.clientId}/access_as_user`] //scope added in server registration step
};

export const teamsUserRequest = {
  scopes: [
    'https://auth.msft.communication.azure.com/Teams.ManageCalls',
    'https://auth.msft.communication.azure.com/Teams.ManageChats'
  ]
};

export const teamsUserLoginRequest = {
  ...loginRequest,
  extraScopesToConsent: teamsUserRequest.scopes
};
