/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';
import './styles/App.css';
import { TestCallContent } from './components/TestCallContent';
import { TestCallTeamsUserContent } from './components/TestCallTeamsUserContent';
import { useSessionStorage } from './reactExtensions';

/**
 * If a user is authenticated as a regular Azure AD user, the TestCallContent component is rendered.
 * If a user is authenticated as a Azure AD user with a valid teams license, the TestCallTeamsUserContent component is rendered.
 * Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = (props) => {
  let content;
  if (props.isTeamsUser) {
    content = <TestCallTeamsUserContent />;
  } else {
    content = <TestCallContent />;
  }

  return (
    <div className="App">
      <AuthenticatedTemplate>{content}</AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5 className="card-title">Please sign-in to join the call.</h5>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default function App() {
  const [isTeamsUser, setIsTeamsUser] = useSessionStorage('isTeamsUser', false);
  return (
    <PageLayout setIsTeamsUser={setIsTeamsUser} isTeamsUser={isTeamsUser}>
      <MainContent isTeamsUser={isTeamsUser} />
    </PageLayout>
  );
}
