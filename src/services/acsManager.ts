/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CommunicationAccessToken,
  CommunicationIdentityClient,
  CommunicationUserToken
} from '@azure/communication-identity';
import { appSettings } from '../appSettings';

export const acsManager = {
  /**
   * Authenticate with Azure AD
   */
  createAuthenticatedClient: (): CommunicationIdentityClient => {
    const connectionString = appSettings.remoteResources.communicationServices.connectionString;
    const identityClient = new CommunicationIdentityClient(connectionString);

    return identityClient;
  },

  /**
   * Create a Communication Servicesidentity using the client authenticated with Azure AD
   */
  createACSUserIdentity: async (): Promise<string> => {
    const identityClient = acsManager.createAuthenticatedClient();
    // Create an identity
    const identityResponse = await identityClient.createUser();

    console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

    return identityResponse.communicationUserId;
  },

  /**
   * Issue an access token for an already existing Communication Services identity
   * @param acsUserId - The unique id of the user whose tokens are being issued.
   */
  createACSToken: async (acsUserId: string): Promise<CommunicationAccessToken> => {
    const identityClient = acsManager.createAuthenticatedClient();
    // Issue an access token with the "voip" and "chat" scope for an identity
    const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    const tokenResponse = await identityClient.getToken(identityResponse, ['voip', 'chat']);

    console.log(`\nThe  access token issued is ${tokenResponse.token}`);
    console.log(`\nIssued an access token with 'voip' scope that expires at ${tokenResponse.expiresOn}:`);

    return tokenResponse;
  },

  /**
   * Create a Communication Services identity and issue an access token for it in one go
   */
  createACSUserIdentityAndToken: async (): Promise<CommunicationUserToken> => {
    const identityClient = acsManager.createAuthenticatedClient();
    // Issue an identity and an access token with the "voip" and "chat" scope for the new identity
    const identityTokenResponse = await identityClient.createUserAndToken(['voip', 'chat']);

    console.log(`\nCreated an identity with ID: ${identityTokenResponse.user.communicationUserId}`);
    console.log(`\nThe  access token issued is ${identityTokenResponse.token}`);
    console.log(`\nIssued an access token with 'voip' scope that expires at ${identityTokenResponse.expiresOn}:`);

    return identityTokenResponse;
  },

  /**
   * Delete a Communication Services identity which will revokes all active access tokens
   * and prevents the user from issuing access tokens for the identity.
   * It also removes all the persisted content associated with the identity.
   * @param acsUserId - The unique Communication Services identity
   */
  deleteACSUserIdentity: async (acsUserId: string): Promise<void> => {
    const identityClient = acsManager.createAuthenticatedClient();
    const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    // Delete an identity
    await identityClient.deleteUser(identityResponse);

    console.log(`\nDeleted the identity with ID: ${identityResponse.communicationUserId}`);
  }
};
