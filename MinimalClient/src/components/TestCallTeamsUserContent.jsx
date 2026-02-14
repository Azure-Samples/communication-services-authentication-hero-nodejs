/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import React, { useState, useEffect } from 'react';
import { loginRequest, teamsUserRequest } from '../authConfig';
import { useMsal } from '@azure/msal-react';
import { GetAcsTokenForTeamsUser } from '../acsAuthApiCaller';
import { AzureCommunicationTokenCredential, getIdentifierRawId } from '@azure/communication-common';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import Button from 'react-bootstrap/Button';

let updatedAdapter = true;

export const TestCallTeamsUserContent = () => {
  const { instance, accounts } = useMsal();
  const [aadToken, setAadToken] = useState('');
  const [teamsToken, setTeamsToken] = useState('');
  const [acsToken, setAcsToken] = useState('');
  const [acsID, setId] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [callAdapter, setCallAdapter] = useState(null);
  const [joinTeamsButtonText, setJoinTeamsButtonText] = useState('Join as a Teams user');

  async function getCommunicationTokenForTeamsUser() {
    // Silently acquires an access token which is then used for authorization against the backend
    const backendAadToken = await instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      })
      .catch((error) => console.log(error));

    // Silently acquires an access token which is then used as a payload for the (Microsoft Entra ID->ACS) token exchange
    const teamsAadToken = await instance
      .acquireTokenSilent({
        ...teamsUserRequest,
        account: accounts[0]
      })
      .catch((error) => console.log(error));

    return GetAcsTokenForTeamsUser(backendAadToken.accessToken, teamsAadToken.accessToken)
      .then((message) => {
        return { aadToken: backendAadToken, teamsToken: teamsAadToken, acsToken: message.token };
      })
      .catch((error) => console.log(error));
  }

  async function RequestTeamsUserCallData() {
    setJoinTeamsButtonText('Loading call...');
    getCommunicationTokenForTeamsUser().then((response) => {
      let rawId = getIdentifierRawId({ microsoftTeamsUserId: response.aadToken.uniqueId });
      setAcsToken(response.acsToken);
      setId(rawId);
    });
  }

  useEffect(() => {
    getCommunicationTokenForTeamsUser().then((tokens) => {
      setAadToken(tokens.aadToken.accessToken);
      setTeamsToken(tokens.teamsToken.accessToken);
      setAcsToken(tokens.acsToken);
    });
  }, []);

  if (acsToken != '' && acsID != '' && callAdapter == null && updatedAdapter && meetingLink != '') {
    updatedAdapter = false;
    createAzureCommunicationCallAdapter({
      userId: { communicationUserId: acsID },
      credential: new AzureCommunicationTokenCredential({
        refreshProactively: true,
        token: acsToken,
        tokenRefresher: async () => {
          const refreshedToken = await getCommunicationTokenForTeamsUser();
          return refreshedToken.acsToken;
        }
      }),
      locator: { meetingLink: meetingLink }
    })
      .then((adapter) => setCallAdapter(adapter))
      .catch((error) => console.log(error));
  }

  if (callAdapter) {
    return (
      <>
        <h5 className="card-title">Welcome {accounts[0].name}</h5>
        <a href={meetingLink}>Teams Meeting link</a>
        <div style={{ width: '100vw', height: '45vh' }}>{<CallComposite adapter={callAdapter} />}</div>
      </>
    );
  } else {
    return (
      <>
        <h5 className="card-title">Welcome {accounts[0].name} </h5>
        <h5 className="card-title">
          AAD Access Token :&nbsp;&nbsp;
          <input type="text" defaultValue={aadToken} id="accessTokenTextBox" />
        </h5>
        <h5 className="card-title">
          AAD Token for a Teams user (with Teams.ManageCalls and Teams.ManageChats permissions):&nbsp;&nbsp;
          <input type="text" defaultValue={teamsToken} id="teamsTokenTextBox" />
        </h5>
        <h5 className="card-title">
          Communication Token :&nbsp;&nbsp;
          <input type="text" defaultValue={acsToken} id="communicationTokenTextBox" />
        </h5>
        <h5 className="card-title">
          Teams Meeting Link :&nbsp;&nbsp;
          <input
            type="text"
            id="meetingLinkTextBox"
            value={meetingLink}
            onChange={(event) => setMeetingLink(event.target.value)}
          />
        </h5>
        <Button variant="secondary" onClick={RequestTeamsUserCallData} disabled={!meetingLink}>
          {joinTeamsButtonText}
        </Button>
      </>
    );
  }
};
