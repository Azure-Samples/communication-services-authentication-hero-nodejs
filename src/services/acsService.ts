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
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { appSettings } from '../appSettings';

export const acsService = {
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
    const identityClient = acsService.createAuthenticatedClient();
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
    const identityClient = acsService.createAuthenticatedClient();
    // Issue an access token with the "voip" and "chat" scope for an identity
    const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    const tokenResponse = await identityClient.getToken(
      identityResponse,
      appSettings.remoteResources.communicationServices.scopes
    );

    console.log(
      `\nIssued an access token with ${appSettings.remoteResources.communicationServices.scopes} scope that expires at ${tokenResponse.expiresOn}:`
    );
    console.log(`\n${tokenResponse.token}`);

    return tokenResponse;
  },

  /**
   * Create a Communication Services identity and issue an access token for it in one go
   */
  createACSUserIdentityAndToken: async (): Promise<CommunicationUserToken> => {
    const identityClient = acsService.createAuthenticatedClient();
    // Issue an identity and an access token with the "voip" and "chat" scope for the new identity
    const identityTokenResponse = await identityClient.createUserAndToken(
      appSettings.remoteResources.communicationServices.scopes
    );

    console.log(`\nCreated an identity with ID: ${identityTokenResponse.user.communicationUserId}`);
    console.log(
      `\nIssued an access token with ${appSettings.remoteResources.communicationServices.scopes} scope that expires at ${identityTokenResponse.expiresOn}:`
    );
    console.log(`\n${identityTokenResponse.token}`);

    return identityTokenResponse;
  },

  /**
   * Delete a Communication Services identity which will revokes all active access tokens
   * and prevents the user from issuing access tokens for the identity.
   * It also removes all the persisted content associated with the identity.
   * @param acsUserId - The unique Communication Services identity
   */
  deleteACSUserIdentity: async (acsUserId: string): Promise<void> => {
    const identityClient = acsService.createAuthenticatedClient();
    const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    // Delete an identity
    await identityClient.deleteUser(identityResponse);

    console.log(`\nDeleted the identity with ID: ${identityResponse.communicationUserId}`);
  }
};