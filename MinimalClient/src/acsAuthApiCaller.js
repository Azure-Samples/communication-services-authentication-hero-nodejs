/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

export async function GetAcsToken(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers
  };

  return await fetch('http://localhost:3000/api/token', options) //Update this to your deployed endpoint if not testing locally
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
