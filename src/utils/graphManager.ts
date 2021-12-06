/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Client } from '@microsoft/microsoft-graph-client';
import { Constants } from '../config/constants';

const ADD_ACS_USER_ERROR =
  'An error has occured when adding the AAD_USER_ID vs ACS_USER_ID mapping information to a user resource';
const GET_ACS_USER_ERROR = 'An error has occured when retrieving the ACS user id';

export const graphManager = {
  //Creating a Graph client instance via options method.
  createAuthenticatedClient: (accessToken: string): Client => {
    // Initialize Graph client
    const client = Client.init({
      // Use the provided access token to authenticate requests
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
    return client;
  },

  getACSUserId: async (accessToken: string, tenantID: string): Promise<string> => {
    const client = graphManager.createAuthenticatedClient(accessToken);
    const response = await client.api('/me').expand('extensions').select('id').get();

    if (!response.ok) {
      throw new Error(GET_ACS_USER_ERROR);
    }

    const roamingProfileInfoJson = await response.json();

    return roamingProfileInfoJson['extensions'][tenantID];
  },

  addIdentityMapping: async (accessToken: string, tenantID: string, acsUserId: string): Promise<any> => {
    const client = graphManager.createAuthenticatedClient(accessToken);

    const extension = {
      '@odata.type': 'microsoft.graph.openTypeExtension',
      extensionName: Constants.OPEN_EXTENSION_NAME,
      tenantID: acsUserId
    };

    const response = await client.api('/me/extensions').post(extension);

    if (!response.ok) {
      throw new Error(ADD_ACS_USER_ERROR);
    }

    return response;
  },

  deleteIdentityMapping: async (accessToken: string): Promise<number> => {
    const client = graphManager.createAuthenticatedClient(accessToken);
    const response = await client.api(`/me/extensions/${Constants.OPEN_EXTENSION_NAME}`).delete();

    return response.statusCode;
  }
};
