/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

const SERVER_ADDRESS = 'http://localhost:5000/'; // Update this to your deployed endpoint if not testing locally

export async function GetAcsToken(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers
  };

  return fetch(`${SERVER_ADDRESS}api/token`, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function GetAcsTokenForTeamsUser(accessToken, teamsToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);
  headers.append('teams-user-aad-token', teamsToken);

  const options = {
    method: 'GET',
    headers: headers
  };

  return fetch(`${SERVER_ADDRESS}api/token/teams`, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function CreateOrGetACSUser(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'POST',
    headers: headers
  };

  return fetch(`${SERVER_ADDRESS}api/user`, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
