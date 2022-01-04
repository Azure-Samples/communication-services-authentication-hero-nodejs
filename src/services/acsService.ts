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

// Error messages
const CREATE_ACS_USER_IDENTITY_ERROR = 'An error occured when creating an ACS user id';
const CREATE_ACS_TOKEN_ERROR = 'An error occured when creating an ACS token';
const CREATE_ACS_USER_IDENTITY_TOKEN_ERROR =
  'An error occured when creating an ACS user id and issuing an access token for it in one go';
const DELETE_ACS_USER_IDENTITY_ERROR = 'An error occured when deleting an ACS user id';

export const acsService = {
  /**
   * Authenticate with Azure AD
   */
  createAuthenticatedClient: (): CommunicationIdentityClient => {
    const connectionString = appSettings.communicationServices.connectionString;
    const identityClient = new CommunicationIdentityClient(connectionString);

    return identityClient;
  },

  /**
   * Create a Communication Servicesidentity using the client authenticated with Azure AD
   */
  createACSUserIdentity: async (): Promise<string> => {
    const identityClient = acsService.createAuthenticatedClient();

    try {
      // Create an identity
      const identityResponse = await identityClient.createUser();

      console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

      return identityResponse.communicationUserId;
    } catch (error) {
      console.log(CREATE_ACS_USER_IDENTITY_ERROR);
      throw error;
    }
  },

  /**
   * Issue an access token for an already existing Communication Services identity
   * @param acsUserId - The unique id of the user whose tokens are being issued.
   */
  createACSToken: async (acsUserId: string): Promise<CommunicationAccessToken> => {
    const identityClient = acsService.createAuthenticatedClient();

    try {
      // Issue an access token with the given scopes for an identity
      const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
      const tokenResponse = await identityClient.getToken(identityResponse, appSettings.communicationServices.scopes);

      console.log(
        `\nIssued an access token with ${appSettings.communicationServices.scopes} scope that expires at ${tokenResponse.expiresOn}:`
      );
      console.log(`\n${tokenResponse.token}`);

      return tokenResponse;
    } catch (error) {
      console.log(CREATE_ACS_TOKEN_ERROR);
      throw error;
    }
  },

  /**
   * Create a Communication Services identity and issue an access token for it in one go
   */
  createACSUserIdentityAndToken: async (): Promise<CommunicationUserToken> => {
    const identityClient = acsService.createAuthenticatedClient();

    try {
      // Issue an identity and an access token with the given scopes for the new identity
      const identityTokenResponse = await identityClient.createUserAndToken(appSettings.communicationServices.scopes);

      console.log(`\nCreated an identity with ID: ${identityTokenResponse.user.communicationUserId}`);
      console.log(
        `\nIssued an access token with ${appSettings.communicationServices.scopes} scope that expires at ${identityTokenResponse.expiresOn}:`
      );
      console.log(`\n${identityTokenResponse.token}`);

      return identityTokenResponse;
    } catch (error) {
      console.log(CREATE_ACS_USER_IDENTITY_TOKEN_ERROR);
      throw error;
    }
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

    try {
      // Delete an identity
      await identityClient.deleteUser(identityResponse);

      console.log(`\nDeleted the identity with ID: ${identityResponse.communicationUserId}`);
    } catch (error) {
      console.log(DELETE_ACS_USER_IDENTITY_ERROR);
      throw error;
    }
  }
};
