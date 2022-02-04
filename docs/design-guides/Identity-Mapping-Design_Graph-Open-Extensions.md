# Identity Mapping Design

## Table of content

- [Scenario](#scenario)
- [Overview](#overview)
- [1:1 Azure Communication Services Identity and Azure Active Directory user Identity mapping](#11-azure-communication-services-identity-and-azure-active-directory-user-identity-mapping)
- [Contributing](#contributing)
- [More Information](#more-information)

## Scenario

The sample solution focuses on token management for below use cases:
- Joining the native Azure Communication Services Chat, Calling / Teams Interop Meetings
- Joining the Teams meeting as Authenticated Team's user

The first scenario requires the identity mapping solution leveraged in `/token` and `/user` endpoints (endpoints implemented to support only the first scenario). The Azure Communication Services identity is mapped to Azure Active Directory user instance, so that the same Azure Communication Services identity for the user can be used in multiple sessions. Please refer the  [Azure Communication Services Identity Model](https://docs.microsoft.com/azure/communication-services/concepts/identity-model)

## Overview

This sample solution demonstrates how to use Microsoft Graph open extensions as the solution of identity mapping storage to build trusted backend service that will manage Azure Communication Services identities by mapping them 1:1 with Azure Active Directory identities (for Teams Interop or native Azure Communication Services calling/chat) and issue Azure Communication Services tokens. For a Azure Active Directory user account, only a single Azure Communication Services Identity specific to a Azure Communication Services resource will be mapped. The Azure Communication Services Identity mapping cannot be updated once written through the sample. However, it is possible to reset the identity mapping of Azure Active Directory account to a different Azure Communication Services Identity by using DELETE `/api/user` endpoint and then recreating the user mapping using POST `/api/user thereafter.

> Note: 
> 1. Developers should not use extensions to store sensitive personally identifiable information, such as account credentials, government identification numbers, cardholder data, financial account data, healthcare information, or sensitive background information.
>
> 2. Microsoft Graph has two extension types: 
>    1. [Open extensions](https://docs.microsoft.com/graph/extensibility-overview#open-extensions)  (**Untyped** data)
>    2. [Schema extensions](https://docs.microsoft.com/graph/extensibility-overview#schema-extensions) (**Typed** data)
>
>    The reason why we use the open extensions here is that we only store simple key-value mapping in this scenario, not typed data.
>
> 3. It is worth mentioning that a maximum of **2** **open extensions** are allowed per resource instance while **schema extensions**' maximum is **5**. To learm more about known issues, please visit [Known Extensions Limitations](https://docs.microsoft.com/graph/known-issues#extensions).

![ Azure Communication Services Authentication Server - Identity Mapping Flow](../images/ACS-Authentication-Server-Sample_Identity-Mapping-Flow.png)

## 1:1 Azure Communication Services Identity and Azure Active Directory user Identity mapping

As displayed in the Azure Communication Services Authentication Server - Identity Mapping overview sequence diagram below, the identity mapping part consists of two endpoints - `/user` and `/token`

![Azure Communication Services Authentication Server - Identity Mapping Sequence Diagram](../images/ACS-Authentication-Server-Sample_Identity-Mapping-Sequence.png)

Please refer to the [endpoints design doc](./endpoints-and-responses.md) for more details.

## Contributing

If you'd like to contribute to this sample, please refer to our [contribution guidelines](../../CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, check the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## More Information

For more information, visit the following links:

- To lean more about **Azure Communication Services - Identity**, visit:
  - [Quickstart: Create and manage access tokens](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-csharp)
  - [Quickstart: Quickly create Azure Communication Services access tokens for testing](https://docs.microsoft.com/azure/communication-services/quickstarts/identity/quick-create-identity)
  - [Azure Communication Services Identity JavaScript SDK](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-communication-identity/1.0.0/index.html)
- To learn more about **Microsoft Graph Open Extensions**, visit:
  - [Microsoft Graph Extensions Overview](https://docs.microsoft.com/graph/extensibility-overview)
  - [Add custom data to users using open extensions](https://docs.microsoft.com/graph/extensibility-open-users)
  - [Microsoft Graph Extensions Known Limitations](https://docs.microsoft.com/graph/known-issues#extensions)
