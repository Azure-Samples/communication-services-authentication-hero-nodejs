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

/**
 * Instantiate the identity client using the connection string.
 */
const createAuthenticatedClient = (): CommunicationIdentityClient => {
  const connectionString = appSettings.communicationServices.connectionString;
  const identityClient = new CommunicationIdentityClient(connectionString);
  return identityClient;
};

/**
 * Create a Communication Servicesidentity using the client authenticated with Azure AD
 */
export const createACSUserIdentity = async (): Promise<string> => {
  const identityClient = createAuthenticatedClient();
  try {
    // Create an identity
    const identityResponse = await identityClient.createUser();

    return identityResponse.communicationUserId;
  } catch (error) {
    console.log(CREATE_ACS_USER_IDENTITY_ERROR);
    throw error;
  }
};

/**
 * Issue an access token for an already existing Communication Services identity
 * @param acsUserId - The unique id of the user whose tokens are being issued.
 */
export const createACSToken = async (acsUserId: string): Promise<CommunicationAccessToken> => {
  const identityClient = createAuthenticatedClient();
  try {
    // Issue an access token with the given scopes for an identity
    const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    const tokenResponse = await identityClient.getToken(identityResponse, appSettings.communicationServices.scopes);

    return tokenResponse;
  } catch (error) {
    console.log(CREATE_ACS_TOKEN_ERROR);
    throw error;
  }
};

/**
 * Create a Communication Services identity and issue an access token for it in one go
 */
export const createACSUserIdentityAndToken = async (): Promise<CommunicationUserToken> => {
  const identityClient = createAuthenticatedClient();
  try {
    // Issue an identity and an access token with the given scopes for the new identity
    const identityTokenResponse = await identityClient.createUserAndToken(appSettings.communicationServices.scopes);

    return identityTokenResponse;
  } catch (error) {
    console.log(CREATE_ACS_USER_IDENTITY_TOKEN_ERROR);
    throw error;
  }
};

/**
 * Delete a Communication Services identity which will revokes all active access tokens
 * and prevents the user from issuing access tokens for the identity.
 * It also removes all the persisted content associated with the identity.
 * @param acsUserId - The unique Communication Services identity
 */
export const deleteACSUserIdentity = async (acsUserId: string): Promise<void> => {
  const identityClient = createAuthenticatedClient();
  const identityResponse: CommunicationUserIdentifier = { communicationUserId: acsUserId };
  try {
    // Delete an identity
    await identityClient.deleteUser(identityResponse);
  } catch (error) {
    console.log(DELETE_ACS_USER_IDENTITY_ERROR);
    throw error;
  }
};
