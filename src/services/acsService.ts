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
const CREATE_ACS_USER_IDENTITY_ERROR = 'An error occurred when creating an ACS user id';
const CREATE_ACS_TOKEN_ERROR = 'An error occurred when creating an ACS token';
const CREATE_ACS_USER_IDENTITY_TOKEN_ERROR =
  'An error occurred when creating an ACS user id and issuing an access token for it in one go';
const DELETE_ACS_USER_IDENTITY_ERROR = 'An error occurred when deleting an ACS user id';
const EXCHANGE_MEID_TOKEN_ERROR = 'An error occurred when exchanging an Microsoft Entra ID token';

/**
 * Instantiate the identity client using the connection string.
 *
 * @private
 */
export const createAuthenticatedClient = (): CommunicationIdentityClient => {
  const connectionString = appSettings.communicationServices.connectionString;
  return new CommunicationIdentityClient(connectionString);
};

/**
 * Create a Communication Services identity using the client authenticated with Azure AD
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
    return await identityClient.getToken(communicationUserIdentifierObject, appSettings.communicationServices.scopes);
  } catch (error) {
    const errorMessage = `${CREATE_ACS_TOKEN_ERROR}: ${error.message}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Exchange an AAD access token of a Teams user for a new Communication Services AccessToken with a matching expiration time.
 * @param teamsUserMeidToken - The Azure AD token of the Teams user
 * @param userObjectId - Object ID of an Azure AD user (Teams User) to be verified against the OID claim in the Azure AD access token.
 */
export const getACSTokenForTeamsUser = async (
  teamsUserMeidToken: string,
  userObjectId: string
): Promise<CommunicationAccessToken> => {
  const identityClient = createAuthenticatedClient();
  try {
    // Issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.
    const clientId = appSettings.microsoftEntraID.clientId;
    return await identityClient.getTokenForTeamsUser({
      clientId: clientId,
      teamsUserAadToken: teamsUserMeidToken, 
      userObjectId: userObjectId
    });
  } catch (error) {
    const errorMessage = `${EXCHANGE_MEID_TOKEN_ERROR}: ${error.message}`;
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
    return await identityClient.createUserAndToken(appSettings.communicationServices.scopes);
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
