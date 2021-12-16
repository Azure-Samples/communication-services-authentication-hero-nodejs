/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

/**
 * The type of the identity mapping
 */
export type identityMapping = {
  /**
   * The name of the open extension representing some roaming profile information about the user
   */
  extensionName: string;
  /**
   * Id of the CommunicationUser as returned from the Communication Service.
   */
  acsUserIdentity: string;
};
