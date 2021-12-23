/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Configuration, ConfidentialClientApplication } from '@azure/msal-node';
import { appSettings } from '../appSettings';
import { Constants } from '../config/constants';

export const aadManager = {
  /**
   * Create a confidential client application that lets users utilize the OBO workflow
   */
  createConfidentialClientApplication: (): ConfidentialClientApplication => {
    const msalConfig: Configuration = {
      auth: {
        clientId: appSettings.remoteResources.azureActiveDirectory.appRegistrations.applicationId,
        authority: `${Constants.AUTHORITY_HOST}/${appSettings.remoteResources.azureActiveDirectory.appRegistrations.tenantId}`,
        clientSecret: appSettings.remoteResources.azureActiveDirectory.appRegistrations.clientSecret
      }
    };

    const confidentialClientApplication = new ConfidentialClientApplication(msalConfig);

    return confidentialClientApplication;
  }
};
