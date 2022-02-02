/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import { PageLayout } from './components/PageLayout';
import { GetAcsToken } from './acsAuthApiCaller';
import Button from 'react-bootstrap/Button';
import './styles/App.css';
import { v4 as uuidv4 } from 'uuid';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';

let updatedAdapter = true;

const TestCallContent = () => {
    const { instance, accounts } = useMsal();
    const [token, setToken] = useState('');
    const [acsID, setId] = useState('');
    const [callGUID, setCallGUID] = useState('');
    const [callAdapter, setCallAdapter] = useState(null);
    const [username, setUsername] = useState('');
    const [buttonText, setbuttonText] = useState('Join Default Call');

    async function RequestCallData() {
        setCallGUID(document.getElementById('guidTextBox').value);
        // Silently acquires an access token which is then attached to a request for MS Graph data
        setbuttonText('loading call');
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            })
            .then((response) => {
                GetAcsToken(response.accessToken).then((message) => {
                    setToken(message.token);
                    setId(message.user.id);
                });
                setUsername(response.account.username);
            });
    }

    if (username != '' && token != '' && acsID != '' && callAdapter == null && updatedAdapter && callGUID != '') {
        updatedAdapter = false;
        createAzureCommunicationCallAdapter({
            userId: { communicationUserId: acsID },
            displayName: username,
            credential: new AzureCommunicationTokenCredential(token),
            locator: { groupId: callGUID }
        }).then((adapter) => setCallAdapter(adapter));
    }

    if (callAdapter) {
        return (
            <>
                <h5 className="card-title">Welcome {accounts[0].name}</h5>
                <h5 className="card-title">Call GUID: {callGUID}</h5>
                <div style={{ width: '100vw', height: '45vh' }}>
                    {callAdapter && <CallComposite adapter={callAdapter} />}
                </div>
            </>
        );
    } else {
        return (
            <>
                <h5 className="card-title">Welcome {accounts[0].name}</h5>
                <label>Enter a GUID Or Use Generated GUID for the call ID</label>
                <form>
                    <input type="text" defaultValue={uuidv4()} id="guidTextBox" />
                </form>
                <Button variant="secondary" onClick={RequestCallData}>
                    {buttonText}
                </Button>
            </>
        );
    }
};

/**
 * If a user is authenticated the TestCallContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <TestCallContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to join the call.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
