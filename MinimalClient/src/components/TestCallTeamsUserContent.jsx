/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import React, { useState } from 'react';
import { loginRequest, teamsUserRequest } from '../authConfig';
import { useMsal } from '@azure/msal-react';
import { GetAcsTokenForTeamsUser } from '../acsAuthApiCaller';
import { AzureCommunicationTokenCredential, getIdentifierRawId } from '@azure/communication-common';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import Button from 'react-bootstrap/Button';

let updatedAdapter = true;

export const TestCallTeamsUserContent = () => {
  const { instance, accounts } = useMsal();
  const [acsToken, setAcsToken] = useState('');
  const [token, setToken] = useState('');
  const [teamsToken, setTeamsToken] = useState('');
  const [acsID, setId] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [callAdapter, setCallAdapter] = useState(null);
  const [joinTeamsButtonText, setJoinTeamsButtonText] = useState('Join as a Teams user');

  async function RequestTeamsUserCallData() {
    setMeetingLink(document.getElementById('meetingLinkTextBox').value);
    setJoinTeamsButtonText('Loading call...');
    // Silently acquires an access token which is then used for authorization against the backend
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      })
      .then((response) => {
        // Silently acquires an access token which is then used as a payload for the (AAD->ACS) token exchange
        instance
          .acquireTokenSilent({
            ...teamsUserRequest,
            account: accounts[0]
          })
          .then((teamsResponse) => {
            GetAcsTokenForTeamsUser(response.accessToken, teamsResponse.accessToken)
              .then((message) => {
                let communicationIdentifier = {
                  microsoftTeamsUserId: response.account.userId,
                  isAnonymous: false
                };
                let rawId = getIdentifierRawId(communicationIdentifier);
                setAcsToken(message.token);
                setId(rawId);
              })
              .catch((error) => console.log(error));
          });
      });
  }

  // Silently acquires an access token
  instance
    .acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    })
    .then((response) => {
      setToken(response.accessToken);
    });

  instance
    .acquireTokenSilent({
      ...teamsUserRequest,
      account: accounts[0]
    })
    .then((response) => {
      setTeamsToken(response.accessToken);
    });
  if (acsToken != '' && acsID != '' && callAdapter == null && updatedAdapter && meetingLink != '') {
    updatedAdapter = false;
    createAzureCommunicationCallAdapter({
      userId: { communicationUserId: acsID },
      credential: new AzureCommunicationTokenCredential(acsToken),
      locator: { meetingLink: meetingLink }
    })
      .then((adapter) => setCallAdapter(adapter))
      .catch((error) => console.log(error));
  }

  if (callAdapter) {
    return (
      <>
        <h5 className="card-title">Welcome {accounts[0].name}</h5>
        <h5 className="card-title">Teams Meeting link: {meetingLink}</h5>
        <div style={{ width: '100vw', height: '45vh' }}>{<CallComposite adapter={callAdapter} />}</div>
      </>
    );
  } else {
    return (
      <>
        <h5 className="card-title">Welcome {accounts[0].name} </h5>
        <h5 className="card-title">
          AAD Access Token :&nbsp;&nbsp;
          <input type="text" defaultValue={token} id="accessTokenTextBox" />
        </h5>
        <h5 className="card-title">
          AAD Token for a Teams user (with Teams.ManageCalls and Teams.ManageChats permissions):&nbsp;&nbsp;
          <input type="text" defaultValue={teamsToken} id="teamsTokenTextBox" />
        </h5>
        <h5 className="card-title">
          Teams Meeting Link :&nbsp;&nbsp;
          <input type="text" id="meetingLinkTextBox" />
        </h5>
        <Button variant="secondary" onClick={RequestTeamsUserCallData}>
          {joinTeamsButtonText}
        </Button>
      </>
    );
  }
};
