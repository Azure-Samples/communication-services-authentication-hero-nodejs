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

// Error messages
const CREATE_ACS_USER_IDENTITY_ERROR = 'An error occured when creating an ACS user id';
const CREATE_ACS_TOKEN_ERROR = 'An error occured when creating an ACS token';
const CREATE_ACS_USER_IDENTITY_TOKEN_ERROR =
  'An error occured when creating an ACS user id and issuing an access token for it in one go';
const DELETE_ACS_USER_IDENTITY_ERROR = 'An error occured when deleting an ACS user id';
const EXCHANGE_AAD_TOKEN_ERROR = 'An error occured when exchanging an AAD token';

/**
 * Instantiate the identity client using the connection string.
 *
 * @private
 */
export const createAuthenticatedClient = (): CommunicationIdentityClient => {
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
    const errorMessage = `${CREATE_ACS_USER_IDENTITY_ERROR}: ${error.message}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
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
    const communicationUserIdentifierObject: CommunicationUserIdentifier = { communicationUserId: acsUserId };
    const tokenResponse = await identityClient.getToken(
      communicationUserIdentifierObject,
      appSettings.communicationServices.scopes
    );

    return tokenResponse;
  } catch (error) {
    const errorMessage = `${CREATE_ACS_TOKEN_ERROR}: ${error.message}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Exchange an AAD access token of a Teams user for a new Communication Services AccessToken with a matching expiration time.
 * @param aadToken - the Azure AD token of the Teams user
 */
export const getACSTokenForTeamsUser = async (aadToken: string): Promise<CommunicationAccessToken> => {
  const identityClient = createAuthenticatedClient();
  try {
    // Issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.
    // Notice: the function name will be renamed to exchangeTeamsUserAadToken
    // Know more, please read this https://github.com/Azure/azure-sdk-for-js/pull/18306
    const tokenResponse = await identityClient.getTokenForTeamsUser(aadToken);

    return tokenResponse;
  } catch (error) {
    const errorMessage = `${EXCHANGE_AAD_TOKEN_ERROR}: ${error.message}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
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
    const errorMessage = `${CREATE_ACS_USER_IDENTITY_TOKEN_ERROR}: ${error.message}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
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
  const communicationUserIdentifierObject: CommunicationUserIdentifier = { communicationUserId: acsUserId };

  try {
    // Delete an identity
    await identityClient.deleteUser(communicationUserIdentifierObject);
  } catch (error) {
    const errorMessage = `${DELETE_ACS_USER_IDENTITY_ERROR}: ${error.message}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};
