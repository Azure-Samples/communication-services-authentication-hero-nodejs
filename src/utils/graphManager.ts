/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Client } from '@microsoft/microsoft-graph-client';
import { Constants } from '../config/constants';

const ADD_IDENTITY_MAPPING_ERROR = 'An error has occured when adding the identity mapping information';
const GET_ACS_USER_IDENTITY_ERROR = 'An error has occured when retrieving the ACS user id';
const DELETE_IDENTITY_MAPPING_ERROR = 'An error has occured when deleting the identity mapping information';

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

  getACSUserId: async (accessToken: string): Promise<string | undefined> => {
    const client = graphManager.createAuthenticatedClient(accessToken);
    const response = await client.api('/me').expand('extensions').select('id').get();

    if (!response.ok) {
      throw new Error(GET_ACS_USER_IDENTITY_ERROR);
    }

    const roamingProfileInfoJson = await response.json();
    const openExtensionsData = roamingProfileInfoJson['extensions'][0];

    return openExtensionsData && openExtensionsData['acsUserIdentity'];
  },

  addIdentityMapping: async (accessToken: string, acsUserId: string): Promise<any> => {
    const client = graphManager.createAuthenticatedClient(accessToken);

    const extension = {
      '@odata.type': 'microsoft.graph.openTypeExtension',
      extensionName: Constants.OPEN_EXTENSION_NAME,
      acsUserIdentity: acsUserId
    };

    const response = await client.api('/me/extensions').post(extension);

    if (!response.ok) {
      throw new Error(ADD_IDENTITY_MAPPING_ERROR);
    }

    return response.json;
  },

  deleteIdentityMapping: async (accessToken: string): Promise<void> => {
    const client = graphManager.createAuthenticatedClient(accessToken);
    const response = await client.api(`/me/extensions/${Constants.OPEN_EXTENSION_NAME}`).delete();

    if (response.statusCode === 204) {
      throw new Error(DELETE_IDENTITY_MAPPING_ERROR);
    }
  }
};
