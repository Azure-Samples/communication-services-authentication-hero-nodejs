/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// Used to fix the error "PolyFillNotAvailable: Library cannot function without fetch. So, please provide polyfill for it."
import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { identityMapping } from '../types/identityMapping';
import { Constants } from '../config/constants';
import { aadService } from './aadService';

const ADD_IDENTITY_MAPPING_ERROR = 'An error has occured when adding the identity mapping information';
const GET_ACS_USER_IDENTITY_ERROR = 'An error has occured when retrieving the ACS user id';
const DELETE_IDENTITY_MAPPING_ERROR = 'An error has occured when deleting the identity mapping information';

export const graphService = {
  /**
   * Creating a Graph client instance via options method.
   */
  createAuthenticatedClient: async (): Promise<Client> => {
    // Retrive the AAD OBO token issued by Microsoft identity platform
    const accessToken = await aadService.createOBOToken();
    // Initialize Graph client
    const graphServiceClient = Client.init({
      // Use the provided access token to authenticate requests
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
    return graphServiceClient;
  },

  /**
   * Get an Communication Services identity by expanding the extension navigation property.
   */
  getACSUserId: async (): Promise<string | undefined> => {
    const graphServiceClient = graphService.createAuthenticatedClient();
    const roamingProfileInfoResponse = await (await graphServiceClient)
      .api('/me')
      .expand('extensions')
      .select('id')
      .get();

    if (!roamingProfileInfoResponse.extensions.length) {
      throw new Error(GET_ACS_USER_IDENTITY_ERROR);
    }

    const openExtensionsData = roamingProfileInfoResponse['extensions'][0];

    return openExtensionsData && openExtensionsData['acsUserIdentity'];
  },

  /**
   *  Add an identity mapping to a user resource using Graph open extension.
   * @param acsUserId - The Communication Services identity
   */
  addIdentityMapping: async (acsUserId: string): Promise<identityMapping> => {
    const graphServiceClient = graphService.createAuthenticatedClient();
    const extension = {
      '@odata.type': 'microsoft.graph.openTypeExtension',
      extensionName: Constants.EXTENSION_NAME,
      acsUserIdentity: acsUserId
    };

    const response = await (await graphServiceClient).api('/me/extensions').post(extension);

    if (!response.extensionName) {
      throw new Error(ADD_IDENTITY_MAPPING_ERROR);
    }

    return {
      extensionName: response.extensionName,
      acsUserIdentity: response.acsUserIdentity
    };
  },

  /**
   * Delete an identity mapping information from a user's roaming profile
   */
  deleteIdentityMapping: async (): Promise<void> => {
    const graphServiceClient = graphService.createAuthenticatedClient();
    const response = await (await graphServiceClient).api(`/me/extensions/${Constants.EXTENSION_NAME}`).delete();

    if (response && response.error) {
      throw new Error(DELETE_IDENTITY_MAPPING_ERROR);
    }
  }
};
