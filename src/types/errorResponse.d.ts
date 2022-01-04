/**---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

/**
 * The type of the error response
 */
export type ErrorResponse = {
  /**
   * The error status code
   */
  code: number;

  /**
   * A message that describes the current error.
   */
  message: string;

  /**
   * A string representation of the immediate frames on the call stack.
   */
  stack_trace?: string;
};
