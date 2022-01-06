/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// Used to fix the error "PolyFillNotAvailable: Library cannot function without fetch. So, please provide polyfill for it."
import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { IdentityMapping } from '../types/identityMapping';
import { Constants } from '../config/constants';

// Error messages
const ADD_IDENTITY_MAPPING_ERROR = 'An error occured when adding the identity mapping information';
const DELETE_IDENTITY_MAPPING_ERROR = 'An error occured when deleting the identity mapping information';
const IDENTITY_MAPPING_NOT_FOUND_ERROR = 'No identity mapping information stored in Microsoft Graph';

export const graphService = {
  /**
   * Creating a Graph client instance via options method.
   * @param accessToken - The token issued by the Microsoft identity platform
   */
  createAuthenticatedClient: (accessToken: string): Client => {
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
   * @param accessToken - The token issued by the Microsoft identity platform
   */
  getACSUserId: async (accessToken: string): Promise<string | undefined> => {
    const graphServiceClient = graphService.createAuthenticatedClient(accessToken);
    const roamingProfileInfoResponse = await graphServiceClient.api('/me').expand('extensions').select('id').get();

    // Retrieve the identity mapping extension object from the response
    const identityMappingExtensionsData = roamingProfileInfoResponse.extensions.length && roamingProfileInfoResponse.extensions.find((extensionObject: any) => {
      extensionObject.extensionName === Constants.EXTENSION_NAME;
    });

    // No identity mapping information stored in Microsoft Graph
    if (!identityMappingExtensionsData) {
      console.log(IDENTITY_MAPPING_NOT_FOUND_ERROR);
      throw new IdentityMappingNotFoundError(IDENTITY_MAPPING_NOT_FOUND_ERROR);
    }

    return identityMappingExtensionsData['acsUserIdentity'];
  },

  /**
   *  Add an identity mapping to a user resource using Graph open extension.
   * @param accessToken - The token issued by the Microsoft identity platform
   * @param acsUserId - The Communication Services identity
   */
  addIdentityMapping: async (accessToken: string, acsUserId: string): Promise<IdentityMapping> => {
    const graphServiceClient = graphService.createAuthenticatedClient(accessToken);
    const extension = {
      '@odata.type': 'microsoft.graph.openTypeExtension',
      extensionName: Constants.EXTENSION_NAME,
      acsUserIdentity: acsUserId
    };

    const response = await graphServiceClient.api('/me/extensions').post(extension);

    // Fail to add an Communication Services identity mapping information to Microsoft Graph.
    if (!response.extensionName) {
      const errorMessage = `${ADD_IDENTITY_MAPPING_ERROR}: ${response.error.message}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }

    return { acsUserIdentity: response.acsUserIdentity };
  },

  /**
   * Delete an identity mapping information from a user's roaming profile
   * @param accessToken - The token issued by the Microsoft identity platform
   */
  deleteIdentityMapping: async (accessToken: string): Promise<void> => {
    const graphServiceClient = graphService.createAuthenticatedClient(accessToken);
    const response = await graphServiceClient.api(`/me/extensions/${Constants.EXTENSION_NAME}`).delete();

    // Fail to remove an Communication Services identity mapping information from Microsoft Graph.
    if (response && response.error) {
      const errorMessage = `${DELETE_IDENTITY_MAPPING_ERROR}: ${response.error.message}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
};
