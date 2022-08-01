/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import React, { useState } from 'react';
import { loginRequest } from '../authConfig';
import { useMsal } from '@azure/msal-react';
import { GetAcsToken, CreateOrGetACSUser } from '../acsAuthApiCaller';
import { v4 as uuidv4 } from 'uuid';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import Button from 'react-bootstrap/Button';

let updatedAdapter = true;

export const TestCallContent = () => {
  const { instance, accounts } = useMsal();
  const [acsToken, setAcsToken] = useState('');
  const [token, setToken] = useState('');
  const [acsID, setId] = useState('');
  const [callGUID, setCallGUID] = useState('');
  const [callAdapter, setCallAdapter] = useState(null);
  const [username, setUsername] = useState('');
  const [joinButtonText, setJoinButtonText] = useState('Join Default Call');

  async function RequestCallData() {
    setCallGUID(document.getElementById('callGUIDTextBox').value);
    // Silently acquires an access token which is then attached to a request for MS Graph data
    setJoinButtonText('Loading call...');
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      })
      .then((response) => {
        CreateOrGetACSUser(response.accessToken)
          .then(() => {
            GetAcsToken(response.accessToken).then((message) => {
              setAcsToken(message.token);
              setId(message.user.id);
            });
          })
          .catch((error) => console.log(error));
        setUsername(response.account.username);
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

  if (username != '' && acsToken != '' && acsID != '' && callAdapter == null && updatedAdapter && callGUID != '') {
    updatedAdapter = false;
    createAzureCommunicationCallAdapter({
      userId: { communicationUserId: acsID },
      displayName: username,
      credential: new AzureCommunicationTokenCredential(acsToken),
      locator: { groupId: callGUID }
    })
      .then((adapter) => setCallAdapter(adapter))
      .catch((error) => console.log(error));
  }

  if (callAdapter) {
    return (
      <>
        <h5 className="card-title">Welcome {accounts[0].name}</h5>
        <h5 className="card-title">Call GUID: {callGUID}</h5>
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
          Call GUID :&nbsp;&nbsp;
          <input type="text" defaultValue={uuidv4()} id="callGUIDTextBox" />
        </h5>
        <Button variant="secondary" onClick={RequestCallData}>
          {joinButtonText}
        </Button>
      </>
    );
  }
};
