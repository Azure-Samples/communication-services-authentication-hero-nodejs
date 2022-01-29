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

1. [Overview](#overview)
2. [Endpoints](#endpoints)
3. [Code Structure](#code-structure)
4. [Getting Started](#getting-started)
5. [Guidance](#guidance)
  1. [Identity Storage Options](#identity-storage-options)
  2. [Bring Your Own Identity (BYOI)](#bring-your-own-identity-byoi)
6. [Resources](#resources)
7. [Known Issues](#known-issues)
8. [Contributing](#contributing)
9. [Trademark](#trademark)
10. [License](#license)

## Overview

In order to properly implement a secure Azure Communication Services solutions, developers must start by putting in place the correct infrastructure to properly generate user and access token credentials for Azure Communication Services. Azure Communication Services is identity-agnostic, to learn more check out our [conceptual documentation](https://docs.microsoft.com/azure/communication-services/concepts/identity-model).

This repository provides a sample of a server implementation of an authentication service for Azure Communication Services. It uses best practices to build a trusted backend service that issues Azure Communication Services credentials and maps them to Azure Active Direction identities. 

This sample can help you in the following scenarios:
1. As a developer, you need to enable an authentication flow for joining native ACS and Teams Interop calling/chat by mapping an ACS identity to an Azure Active Directory identity and using this same ACS identity for the user to fetch an ACS token in every session.
2. As a developer, you need to enable an authentication flow for Custom Teams Endpoint by using an M365 Azure Active Directory identity of a Teams' user to fetch an ACS token to be able to join Teams calling/chat.

If you are looking to get started with Azure Communication Services, but are still in learning / prototyping phases, check out our [quickstarts for getting started with azure communication services users and access tokens](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript).

> :loudspeaker: An ACS Solutions - Authentication Server Sample (C# version) can be found [here](https://github.com/Azure-Samples/communication-services-authentication-hero-csharp).

![ACS Authentication Server Sample Overview Flow](docs/images/ACS-Authentication-Server-Sample_Overview-Flow.png)

Additional documentation for this sample can be found on [Microsoft Docs](https://docs.microsoft.com/azure/communication-services/samples/calling-hero-sample). !!! TODO: change link?

Since this sample only focuses on the server APIs, the client application is not part of it. If you want to add the client application to login user using Azure AD, then please follow the MSAL samples [here](https://github.com/AzureAD/microsoft-authentication-library-for-js).

## Endpoints

This ACS Solutions - Authentication sample provides the following endpoints:

- **GET /user** - Get an Azure Communication Services identity through Microsoft Graph.

- **POST /user** - Create an Azure Communication Services identity and then add the roaming identity mapping information to Microsoft Graph.

- **DELETE /user** - Delete the identity mapping information from Microsoft Graph including the Azure Communication Services resource related to the Azure Communication Services identity.

- **GET /token** - Get / refresh an Azure Communication Services token for an Azure Communication Services user.

- **GET /token/teams** - Exchange an M365 token of a Teams user for an Azure Communication Services token.

  > :information_source: Teams users are authenticated via the MSAL library against Azure Active Directory in the client application. Authentication tokens are exchanged for Microsoft 365 Teams token via the Azure Communication Services Identity SDK. Developers are encouraged to implement an exchange of tokens in their backend services as exchange requests are signed by credentials for Azure Communication Services. In backend services, developers can require any additional authentication. Learn more [here](https://docs.microsoft.com/en-ca/azure/communication-services/concepts/teams-interop#microsoft-365-teams-identity).

## Code Structure

Here's the breakdown of the repo:
```
.
├── deploy - folder gathering all that is needed for Azure deployment
├── src
│    ├── controllers - folder gathering each controller which describes the path of each route │and the method to call.
│    ├── routes - folder gathering all the application's subpaths.
│    ├── services - folder gathering all services used in the project like Microsoft Graph, │Communication Services and Azure Active Directory.
│    ├── types - folder gathering any self-defined types.
│    ├── utils - folder gathering any helper functions.
│    ├── app.ts - file containing Express configurations and application configurations like │global paths and error handling.
│    ├── appSettings.json - file containing all application settings about Graph Extensions, Communication Services and Azure Active Directory.
│    └── server.ts - file containing process of starting the Express server.
└── tests - folder gathering all unit tests.
     ├── controllers - folder gathering unit tests for each controller.
     ├── services - folder gathering unit tests for each service.
     └── utils - folder gathering all common mock data or testing methods.
```

**Code dpendencies:**
![ACS Authentication Server Sample - Code Dependency Diagram](/docs/images/ACS-Authentication-Server-sample_Dependency-Diagram.png)

## Getting Started

If you're wondering where to get started, here are a few scenarios to help you get going:

* "How does the ACS Authentication Server sample work?"
  * Take a look at our conceptual documentation on:
    - [ACS Authentication Server Sample Architecture Design](). !!! TODO: add link
    - [Secured Web API Architecture Design](./docs/design-guides/Secured-Web-API-Design.md).
    - [Identity Mapping Architecture Design](./docs/design-guides/Identity-Mapping-Design_Graph-Open-Extensions.md). !!! TODO: to add
    - [AAD Token Exchange Architecture Design](). !!! TODO: add link
* "I want to see what this ACS Authentication Server sample can do by running it!" 
  * Check out our [Run Authentication Sample](<docs/contribution-guides/3. run-authentication-sample.md>) guide.
* "I want to submit a fix or a feature for this project"
  * Check out our [making a contribution](CONTRIBUTING.md) guide first.
  * Check out the following guides in sequence after coding.
    * [Test Your Changes](<docs/contribution-guides/4. test-your-changes.md>)
    * [Write Unit Tests](<docs/contribution-guides/5. write-unit-tests.md>)
    * [Submit a PR](<docs/contribution-guides/6. submit-a-pr.md>)
    * [Publish Your Changes](<docs/contribution-guides/7. publish-your-changes.md>)

## Guidance

 !!! TODO

### Identity Storage Options

 !!! TODO

(Add privacy to provide links to data protection of ACS user Id)

(Add a comparison table here...)

### Bring Your Own Identity (BYOI)

 !!! TODO

(AAD B2C)

## Resources

- [Azure Communication Services Documentation](https://docs.microsoft.com/en-us/azure/communication-services/) - Find more about how to add voice, video, chat, and telephony on our official documentation.
- [Azure Communication Services Hero Samples](https://docs.microsoft.com/en-us/azure/communication-services/samples/overview) - Find more ACS samples and examples on our samples overview page.
- [On-Behalf-Of workflow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) - Find more about the OBO workflow
- [Creating a protected API](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) - Detailed example of creating a protected API

## Known Issues

- ...

## Contributing

Join us by making a contribution. To get you started check out our [making a contribution](CONTRIBUTING.md) guide.

We look forward to building an amazing open source ACS Authentication Server sample with you!

## Trademark

**Trademarks** This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE.md)

