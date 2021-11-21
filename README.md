---
page_type: sample
languages:
- javascript
- nodejs
- csharp
products:
- azure
- azure-communication-services
---

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)]()

# ACS Solutions - Authentication Sample

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
4. [Identity Storage Options](#Iidentity-storage-options)
5. [Resources](#resources)
6. [Known Issues](#known-issues)
7. [Trademark](#trademark)
8. [License](#license)

## Overview

In order to properly implement Azure Communication Services solutions, developers must start by putting in place the correct infrastructure to perform key actions for the communications lifecycle. These actions include authenticating users since the Azure Communication Services are identity-agnostic.

This is an ACS solution sample to provide a guidance establishing best practices on a simple use case to bring your own identity (**BYOI**) to the Azure Communication Services by storing the mapping between Azure AD and ACS users. The solution guides below:

- Have a trusted backend service that will create ACS identities and issue access tokens.
- Have this trusted service authenticate users and maintain a mapping between a Contoso identity and an ACS identity.

> An ACS Solutions - Authentication Sample (C# version) can be found [here](https://github.com/Azure-Samples/communication-services-authentication-hero-csharp).

Additional documentation for this sample can be found on [Microsoft Docs](https://docs.microsoft.com/azure/communication-services/samples/calling-hero-sample).

Before contributing to this sample, please read our [contribution guidelines](./CONTRIBUTING.md).

## Features

This ACS Solutions - Authentication sample provides the following features:

* Create an ACS user
* Get a token for an ACS user
* Refresh a token for an existing ACS user
* Exchange an M365 token for an ACS token

(Add workflow graph here...)

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

## Identity Storage Options

(Add a comparison table here...)

## Resources

- [Azure Communication Services Documentation](https://docs.microsoft.com/en-us/azure/communication-services/) - Find more about how to add voice, video, chat, and telephony on our official documentation.
- [Azure Active Directory B2C documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/) - A business-to-customer identity as a service.
- [Azure Communication Services Hero Samples](https://docs.microsoft.com/en-us/azure/communication-services/samples/overview) - Find more ACS samples and examples on our samples overview page.

## Known Issues

* ...

## Trademark

**Trademarks** This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE.md)

