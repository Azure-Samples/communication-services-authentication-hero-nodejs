/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CommunicationAccessToken,
  CommunicationIdentityClient,
  CommunicationUserToken
} from '@azure/communication-identity';
import { DefaultAzureCredential } from '@azure/identity';
import { appSettings } from '../appSettings';

export const acsManager = {
  // Authenticate with Azure AD
  createAuthenticatedClient: (): CommunicationIdentityClient => {
    const endpoint = appSettings.remoteResources.communicationServices.endpoint;
    const tokenCredential = new DefaultAzureCredential();
    const identityClient = new CommunicationIdentityClient(endpoint, tokenCredential);

    return identityClient;
  },

  createACSUserIdentity: async (): Promise<string> => {
    const identityClient = acsManager.createAuthenticatedClient();
    // Create an identity
    const identityResponse = await identityClient.createUser();

    // Add logs here...... try-catch

    return identityResponse.communicationUserId;
  },

  createACSToken: async (acsUserId: string): Promise<CommunicationAccessToken> => {
    const identityClient = acsManager.createAuthenticatedClient();
    // Issue an access token with the "voip" and "chat" scope for an identity
    const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    const tokenResponse = await identityClient.getToken(identityResponse, ['voip', 'chat']);

    // Add logs here...... try-catch

    return tokenResponse;
  },

  createACSUserIdentityAndToken: async (): Promise<CommunicationUserToken> => {
    const identityClient = acsManager.createAuthenticatedClient();
    // Issue an identity and an access token with the "voip" and "chat" scope for the new identity
    const identityTokenResponse = await identityClient.createUserAndToken(['voip', 'chat']);

    // Add logs here...... try-catch

    return identityTokenResponse;
  },

  deleteACSUserIdentity: async (acsUserId: string): Promise<void> => {
    const identityClient = acsManager.createAuthenticatedClient();
    const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    // Delete an identity
    await identityClient.deleteUser(identityResponse);

    // Add logs here...... try-catch
  }
};
