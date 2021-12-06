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

<!--[![CI build status](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/workflows/CI/badge.svg?branch=main)](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/ci.yml?query=branch%3Amain)-->
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/%3C%2F%3E-Node.js-%230074c1.svg)](https://nodejs.org/en/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   2. [Code Structure](#code-structure)
   3. [Before running the sample for the first time](#before-running-the-sample-for-the-first-time)
   4. [Locally deploying the sample app](#locally-deploying-the-sample-app)
   5. [Troubleshooting](#troubleshooting)
   6. [Publish to Azure](#publish-to-azure)
   7. [Building off of the sample](#building-off-of-the-sample)
4. [Guidance](#guidance)
   1. [Identity Storage Options](#Iidentity-storage-options)
   2. [Bring Your Own Identity (BYOI)](#bring-your-own-identity-byoi)
5. [Resources](#resources)
6. [Known Issues](#known-issues)
7. [Contributing](#contributing)
8. [Trademark](#trademark)
9. [License](#license)

## Overview

In order to properly implement Azure Communication Services solutions, developers must start by putting in place the correct infrastructure to perform key actions for the communications lifecycle. These actions include authenticating users since the Azure Communication Services are identity-agnostic.

This is an ACS solution server sample to provide a guidance establishing best practices on a simple use case to build trusted backend service that will manage ACS identities by mapping them 1:1 with Azure Active Directory identities (for Teams Interop or native ACS calling/chat) and issue ACS tokens . There are two scenarios:

1. As a developer, you need to enable authentication flow for joining native ACS and Teams Interop calling/chat by mapping ACS Identity to Azure Active Directory identity and using same ACS identity for the user to fetch ACS tokens in every session.
2. As a developer, you need to enable authentication flow for Custom Teams Endpoint by using Azure Active Directory identity of Teams' user to fetch ACS tokens to join Teams calling/chat.

> :loudspeaker: An ACS Solutions - Authentication Sample (C# version) can be found [here](https://github.com/Azure-Samples/communication-services-authentication-hero-csharp).

Additional documentation for this sample can be found on [Microsoft Docs](https://docs.microsoft.com/azure/communication-services/samples/calling-hero-sample).

Before contributing to this sample, please read our [contribution guidelines](./CONTRIBUTING.md).

## Features

This ACS Solutions - Authentication sample provides the following features:

* **/getUser** - Return an ACS user id if existing in the database, otherwise, create an ACS user and then store the identity mapping.

* **/getToken** - Get / refresh a token for an ACS user.

* **/exchangeToken** - Exchange an M365 token of a Teams user for an ACS token.

  > :information_source: Teams users are authenticated via the MSAL library against Azure Active Directory in the client application. Authentication tokens are exchanged for Microsoft 365 Teams token via the Communication Services Identity SDK. Developers are encouraged to implement an exchange of tokens in your backend services as exchange requests are signed by credentials for Azure Communication Services. In backend services, you can require any additional authentication. Learn more information [here](https://docs.microsoft.com/en-ca/azure/communication-services/concepts/teams-interop#microsoft-365-teams-identity)


(Add a workflow diagram here...)

## Getting Started

### Prerequisites

- ...

### Code Structure

- ...

### Before running the sample for the first time

1. ...

### Locally deploying the sample app

1. ...

### Troubleshooting

1. ...

### Publish to Azure

1. ...

### Building off of the sample

1. ...

## Guidance

### Identity Storage Options

(Add privacy to provide links to data protection of ACS user Id)

(Add a comparison table here...)

### Bring Your Own Identity (BYOI)

(AAD B2C)

## Resources

- [Azure Communication Services Documentation](https://docs.microsoft.com/en-us/azure/communication-services/) - Find more about how to add voice, video, chat, and telephony on our official documentation.
- [Azure Communication Services Hero Samples](https://docs.microsoft.com/en-us/azure/communication-services/samples/overview) - Find more ACS samples and examples on our samples overview page.

## Known Issues

* ...

## Contributing

Join us by making a contribution. To get you started check out our [making a contribution](<.>) guide.

We look forward to building an amazing open source ACS sample with you!

## Trademark

**Trademarks** This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE.md)

