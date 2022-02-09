---
page_type: sample
languages:
  - javascript
  - nodejs
products:
  - azure
  - azure-communication-services
---

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)]()

# ACS Solutions - Authentication Server Sample

[![CI](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/ci.yml/badge.svg)](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/codeql-analysis.yml)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/%3C%2F%3E-Node.js-%230074c1.svg)](https://nodejs.org/en/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- [Overview](#overview)
- [Endpoints](#endpoints)
- [Code Structure](#code-structure)
- [Getting Started](#getting-started)
- [Guidance](#guidance)
  - [Identity Storage Options](#identity-storage-options)
  - [Bring Your Own Identity (BYOI)](#bring-your-own-identity-byoi)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [Trademark](#trademark)
- [License](#license)

## Overview

In order to properly implement a secure Azure Communication Services solutions, developers must start by putting in place the correct infrastructure to properly generate user and access token credentials for Azure Communication Services. Azure Communication Services is identity-agnostic, to learn more check out our [conceptual documentation](https://docs.microsoft.com/azure/communication-services/concepts/identity-model).

This repository provides a sample of a server implementation of an authentication service for Azure Communication Services. It uses best practices to build a trusted backend service that issues Azure Communication Services credentials and maps them to Azure Active Direction identities. 

This sample can help you in the following scenarios:
1. As a developer, you need to enable authentication flow for joining native ACS and Teams Interop calling/chat by mapping an ACS Identity to an Azure Active Directory identity and using this same ACS identity for the user to fetch an ACS token in every session.
2. As a developer, you need to enable authentication flow for Custom Teams Endpoint by using an M365 Azure Active Directory identity of a Teams' user to fetch an ACS token to be able to join Teams calling/chat.

If you are looking to get started with Azure Communication Services, but are still in learning / prototyping phases, check out our [quickstarts for getting started with azure communication services users and access tokens](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript).

> :loudspeaker: An ACS Solutions - Authentication Server Sample (C# version) can be found [here](https://github.com/Azure-Samples/communication-services-authentication-hero-csharp).

![ACS Authentication Server Sample Overview Flow](docs/images/ACS-Authentication-Server-Sample_Overview-Flow.png)

Additional documentation for this sample can be found on [Microsoft Docs](https://docs.microsoft.com/azure/communication-services/samples/calling-hero-sample).

Since the sample only focuses on the server APIs, the client application is not part of the sample. If you want to add the client application to login user using Azure AD, then please follow the MSAL samples [here](https://github.com/AzureAD/microsoft-authentication-library-for-js).

## Endpoints

This ACS Solutions - Authentication sample provides the following endpoints:

- **GET /user** - Get a Communication Services identity through Microsoft Graph.

- **POST /user** - Create a Communication Services identity and then add the roaming identity mapping information to Microsoft Graph.

- **DELETE /user** - Delete the identity mapping information from Microsoft Graph including the ACS resource related to the Communication Services identity.

- **GET /token** - Get / refresh a Communication Services token for an ACS user.

- **GET /token/teams** - Exchange an M365 token of a Teams user for an ACS token.

  > :information_source: Teams users are authenticated via the MSAL library against Azure Active Directory in the client application. Authentication tokens are exchanged for Microsoft 365 Teams token via the Communication Services Identity SDK. Developers are encouraged to implement an exchange of tokens in their backend services as exchange requests are signed by credentials for Azure Communication Services. In backend services, developers can require any additional authentication. Learn more [here](https://docs.microsoft.com/en-ca/azure/communication-services/concepts/teams-interop#microsoft-365-teams-identity)

## Code Structure

Here's the breakdown of the repo:

- src
  - routes - Where to define the application's subpaths.
  - controllers - Where to contain each controller which describes the path of each route and the method to call.
  - services - Where to contain services used in the project like Microsoft Graph, Communication Services and Azure Active Directory.
  - types - Where to contain self-defined types
  - utils - Where to contain helper functions
  - server.ts - Where to start Express server.
  - app.ts - Where to contain Express configurations and application configurations like global paths and error handling.
  - appSettings.ts - Where to contain all application settings about Graph Extensions, Communication Services and Azure Active Directory.
- tests - Where to contain all unit tests.
  - controllers - Where to contain each controller unit tests.
  - services - Where to contain each service unit tests.
  - utils - Where to contain all common mock data or testing methods.
- deploy

![ACS Authentication Server Sample - Code Dependency Diagram](/docs/images/ACS-Authentication-Server-sample_Dependency-Diagram.png)

## Getting Started

If you're wondering where to get started, here are a few scenarios to help you get going:

* "How does the ACS Authentication Server sample work?"
  * Take a look at our conceptual documentation on 
    - [ACS Authentication Server Sample Architecture Design]().
    - [Secured Web API Architecture Design](./docs/design-guides/Secured-Web-API-Design.md).
    - [Identity Mapping Architecture Design](./docs/design-guides/Identity-Mapping-Design_Graph-Open-Extensions.md).
    - [AAD Token Exchange Architecture Design](./docs/design-guides/Token-Exchange-Design.md).
* "I want to see what this ACS Authentication Server sample can do by running!"
  * Check out our [Run Authentication Sample](<docs/contribution-guides/3. run-authentication-sample.md>) guide.
* "I want to submit a fix or a feature for this project"
  * Check out our [making a contribution](CONTRIBUTING.md) guide first.
  * Check out following guides in sequence after coding.
    * [Test Your Changes](<docs/contribution-guides/4. test-your-changes.md>)
    * [Write Unit Tests](<docs/contribution-guides/5. write-unit-tests.md>)
    * [Submit a PR](<docs/contribution-guides/6. submit-a-pr.md>)
    * [Publish Your Changes](<docs/contribution-guides/7. publish-your-changes.md>)

## Guidance

### Identity Storage Options

(Add privacy to provide links to data protection of ACS user Id)

(Add a comparison table here...)

### Bring Your Own Identity (BYOI)

(AAD B2C)

## Known Issues

- ...

## Contributing

Join us by making a contribution. To get you started check out our [making a contribution](CONTRIBUTING.md) guide.

We look forward to building an amazing open source ACS Authentication Server sample with you!

## Trademark

**Trademarks** This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE.md)

