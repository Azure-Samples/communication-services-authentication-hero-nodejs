/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

// Used to fix the error "PolyFillNotAvailable: Library cannot function without fetch. So, please provide polyfill for it."
import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { Constants } from '../config/constants';

// Error messages
const RETRIEVE_IDENTITY_MAPPING_ERROR = 'An error occured when retrieving the identity mapping information';
const ADD_IDENTITY_MAPPING_ERROR = 'An error occured when adding the identity mapping information';
const DELETE_IDENTITY_MAPPING_ERROR = 'An error occured when deleting the identity mapping information';

/* eslint-disable @typescript-eslint/no-explicit-any */
const getIdentityMappingExtension = (roamingProfileInfoResponse: any) => {
  for (const extensionObject of roamingProfileInfoResponse.extensions) {
    if (extensionObject.extensionName === Constants.EXTENSION_NAME) {
      return extensionObject;
    }
  }
};

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  getACSUserId: async (accessToken: string): Promise<any> => {
    const graphServiceClient = graphService.createAuthenticatedClient(accessToken);

    try {
      const roamingProfileInfoResponse = await graphServiceClient.api('/me').expand('extensions').select('id').get();

      const identityMappingExtensionsData =
        roamingProfileInfoResponse.extensions.length && getIdentityMappingExtension(roamingProfileInfoResponse);

      // No identity mapping information stored in Microsoft Graph
      if (!identityMappingExtensionsData) {
        return undefined;
      }

      return identityMappingExtensionsData['acsUserIdentity'];
    } catch (error) {
      console.log(error);
      // Fail to retrieve an Communication Services identity mapping information from Microsoft Graph.
      const errorMessage = `${RETRIEVE_IDENTITY_MAPPING_ERROR}: ${error.message}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   *  Add an identity mapping to a user resource using Graph open extension.
   * @param accessToken - The token issued by the Microsoft identity platform
   * @param acsUserId - The Communication Services identity
   */
  addIdentityMapping: async (accessToken: string, acsUserId: string): Promise<any> => {
    const graphServiceClient = graphService.createAuthenticatedClient(accessToken);
    const extension = {
      '@odata.type': 'microsoft.graph.openTypeExtension',
      extensionName: Constants.EXTENSION_NAME,
      acsUserIdentity: acsUserId
    };

    try {
      const response = await graphServiceClient.api('/me/extensions').post(extension);
      return { acsUserIdentity: response.acsUserIdentity };
    } catch (error) {
      // Fail to add an Communication Services identity mapping information to Microsoft Graph.
      const errorMessage = `${ADD_IDENTITY_MAPPING_ERROR}: ${error.message}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete an identity mapping information from a user's roaming profile
   * @param accessToken - The token issued by the Microsoft identity platform
   */
  deleteIdentityMapping: async (accessToken: string): Promise<any> => {
    const graphServiceClient = graphService.createAuthenticatedClient(accessToken);

    try {
      await graphServiceClient.api(`/me/extensions/${Constants.EXTENSION_NAME}`).delete();
    } catch (error) {
      // Fail to remove an Communication Services identity mapping information from Microsoft Graph.
      const errorMessage = `${DELETE_IDENTITY_MAPPING_ERROR}: ${error.message}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
};
