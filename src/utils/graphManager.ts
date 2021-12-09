/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Client } from '@microsoft/microsoft-graph-client';
import { identityMapping } from '../types/identityMapping';
import { Constants } from '../config/constants';

const ADD_IDENTITY_MAPPING_ERROR = 'An error has occured when adding the identity mapping information';
const GET_ACS_USER_IDENTITY_ERROR = 'An error has occured when retrieving the ACS user id';
const DELETE_IDENTITY_MAPPING_ERROR = 'An error has occured when deleting the identity mapping information';

export const graphManager = {
  /**
   * Creating a Graph client instance via options method.
   * @param accessToken - The token issued by the Microsoft identity platform
   */
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

  /**
   * Get an Communication Services identity by expanding the extension navigation property.
   * @param accessToken - The token issued by the Microsoft identity platform
   */
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

  /**
   *  Add an identity mapping to a user resource using Graph open extensions.
   * @param accessToken - The token issued by the Microsoft identity platform
   * @param acsUserId - The Communication Services identity
   */
  addIdentityMapping: async (accessToken: string, acsUserId: string): Promise<identityMapping> => {
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

    return {
      extensionName: response.json().extensionName,
      acsUserIdentity: response.json().acsUserIdentity
    };
  },

  /**
   * Delete an identity mapping information from a user's roaming profile
   * @param accessToken - The token issued by the Microsoft identity platform
   */
  deleteIdentityMapping: async (accessToken: string): Promise<void> => {
    const client = graphManager.createAuthenticatedClient(accessToken);
    const response = await client.api(`/me/extensions/${Constants.OPEN_EXTENSION_NAME}`).delete();

    if (response.statusCode !== 204) {
      throw new Error(DELETE_IDENTITY_MAPPING_ERROR);
    }
  }
};
