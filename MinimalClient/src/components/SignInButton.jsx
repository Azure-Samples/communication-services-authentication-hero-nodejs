/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, teamsUserLoginRequest } from '../authConfig';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/esm/Dropdown';

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = (props) => {
  const { instance } = useMsal();

  const handleLogin = (loginType, isTeamsUser) => {
    let request = isTeamsUser ? teamsUserLoginRequest : loginRequest;
    props.setIsTeamsUser(isTeamsUser);
    if (loginType === 'popup') {
      instance.loginPopup(request).catch((e) => {
        console.log(e);
      });
    } else if (loginType === 'redirect') {
      instance.loginRedirect(request).catch((e) => {
        console.log(e);
      });
    }
  };
  return (
    <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
      <Dropdown.Item as="button" onClick={() => handleLogin('popup', false)}>
        Sign in using Popup
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => handleLogin('redirect', false)}>
        Sign in using Redirect
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => handleLogin('popup', true)}>
        Sign in as a Teams user using Popup
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => handleLogin('redirect', true)}>
        Sign in as Teams user using Redirect
      </Dropdown.Item>
    </DropdownButton>
  );
};
