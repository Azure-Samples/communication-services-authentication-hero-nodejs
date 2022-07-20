/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface IUser {
  oid: string;
}
