---
page_type: sample
languages:
- javascript
- nodejs
products:
- azure
- azure-communication-services
---

Deploy to Azure using instructions [here](./docs/deployment-guides/deploy-and-test-sample-on-azure.md).

# Azure Communication Services Solutions - Authentication Server Sample

[![CI](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/ci.yml/badge.svg)](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/actions/workflows/codeql-analysis.yml)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/%3C%2F%3E-Node.js-%230074c1.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Endpoints](#endpoints)
5. [Troubleshooting](#troubleshooting)
   - 5.1 [Application Troubleshooting](#application-troubleshooting)
6. [Need Help](#need-help)
7. [Contributing](#contributing)
8. [Resources](#resources)
9. [Trademark](#trademark)
10. [License](#license)

## Overview

In order to properly implement a secure Azure Communication Services solutions, developers must start by putting in place the correct infrastructure to properly generate user and access token credentials for Azure Communication Services. Azure Communication Services is identity-agnostic, to learn more check out our [conceptual documentation](https://docs.microsoft.com/azure/communication-services/concepts/identity-model).

This repository provides a sample of a server implementation of an authentication service for Azure Communication Services. It uses best practices to build a trusted backend service that issues Azure Communication Services credentials and maps them to Azure Active Directory identities. 

This sample can help you in the following scenarios:
1. As a developer, you need to enable an authentication flow for joining native Azure Communication Services and/or Teams Interop calling/chat which is done by mapping an Azure Communication Services identity to an Azure Active Directory identity and using this same Azure Communication Services identity for the user to fetch an Azure Communication Services token in every session.
2. As a developer, you need to enable an authentication flow for the Azure Communication Services support for Teams identities which is done by using an M365 Azure Active Directory identity of a Teams' user to fetch an Azure Communication Services token to be able to join Teams calling/chat.

If you are looking to get started with Azure Communication Services, but are still in learning / prototyping phases, check out our [quickstarts for getting started with azure communication services users and access tokens](https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript).

> :loudspeaker: An Azure Communication Services Solutions - Authentication Sample (C# version) can be found [here](https://github.com/Azure-Samples/communication-services-authentication-hero-csharp).

![Azure Communication Services Authentication Server Sample Overview Flow](docs/images/ACS-Authentication-Server-Sample_Overview-Flow.png)

Additional documentation for this sample can be found on [Microsoft Docs](https://docs.microsoft.com/azure/communication-services/samples/trusted-auth-sample).

Since this sample only focuses on the server APIs, the client application is not part of it. If you want to add the client application to login user using Azure Active Directory, then please follow the MSAL samples [here](https://github.com/AzureAD/microsoft-authentication-library-for-js).

Before contributing to this sample, please read our [contribution guidelines](./CONTRIBUTING.md).

## Prerequisites

To be able to run this sample, you will need to:

- Register a Client and Server (Web API) applications in Azure Active Directory as part of [On Behalf Of workflow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). Follow instructions on how to [set up App Registrations](./docs/deployment-guides/set-up-app-registrations.md)
- Create an Azure Communication Services resource through [Azure Portal](https://portal.azure.com). Follow [Quickstart: Create and manage Communication Services resources](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp) to create an Azure Communication Services resource using Azure Portal.

## Getting Started

If you're wondering where to get started, here are a few scenarios to help you get going:

* "How does the Azure Communication Services Authentication server sample work?"
  * Take a look at our conceptual documentation on:
    - [Azure Communication Services Authentication Server Sample Architecture Design](./docs/design-guides/architecture-overview.md).
    - [Secured Web API Architecture Design](./docs/design-guides/secured-web-api-design.md).
    - [Identity Mapping Architecture Design](./docs/design-guides/identity-mapping-design-graph-open-extensions.md).
    - [Azure Active Directory Token Exchange Architecture Design](./docs/design-guides/token-exchange-design.md).
* "I want to see what this Azure Communication Services Authentication Server sample can do by running it!"
  * Check out our [local deployment guide](./docs/deployment-guides/deploy-locally.md) guide.
* "I want to submit a fix or a feature for this project"
  * Check out our [contribution guidelines](CONTRIBUTING.md) first.
  * Check out the following guides in sequence after coding.
    * [Test Your Changes](<docs/contribution-guides/2. test-your-changes.md>)
    * [Write Unit Tests](<docs/contribution-guides/3. write-unit-tests.md>)
    * [Submit a PR](<docs/contribution-guides/4. submit-a-pr.md>)
    * [Publish Your Changes](<docs/contribution-guides/5. publish-your-changes.md>)

## Endpoints

This Azure Communication Services Solutions - Authentication server sample provides responses for **user** and **token** endpoints. For more details, please check our [Endpoints and Responses designe doc](./docs/design-guides/endpoints-and-responses.md).

## Troubleshooting

1. Maximum number of extensions values supported per application is 2.
   > An application can add [at most two open extensions](https://docs.microsoft.com/graph/extensibility-overview#open-extension-limits) for an Azure Active Directory user. 

   > **Resolution:** If more than 2 extensions are required, then Graph Open Extensions cannot be used to persist the Azure Communication Services Identity mapping as in the sample. You need to consider Alternative Identity Mapping as suggested in [Architecture Overview](./docs/design-guides/architecture-overview.md). Otherwise, you can delete the extensions following [Graph Open Extensions Delete API](https://docs.microsoft.com/graph/extensibility-open-users#4-delete-a-users-roaming-profile). You can delete the extension for any user, if you are M365 Tenant/Azure Active Directory Admin. You can use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to execute for a single user.

2. Provided identity doesn't belong to the resource.
   > This issue happens if there is mismatch of Azure Communication Services Identity persisted within Graph Open Extensions user instance and the Azure Communication Services resource.
   >
   > The scenario would happen when the Azure Communication Service Identity mapping for a Azure Active Directory user account was created with one Azure Communication Services resource in the deployed sample and the Azure Communication Services resource changed with subsequent deployments. 

   > **Resolution:** Swap the Azure Communication Services resource used in the deployed sample as was used in prior deployment. Otherwise delete the extension within Graph Open extensions using the resolution step for above issue.

3. For troubleshooting Azure Active Directory Token issues, please refer to [Troubleshoot AAD Token](https://docs.microsoft.com/azure/databricks/dev-tools/api/latest/aad/troubleshoot-aad-token).

4. For troubleshooting consent issues during Azure Active Directory authentication flow, please refer to [Unexpected user consent error](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-unexpected-user-consent-error#requesting-not-authorized-permissions-error), [Unexpected user consent prompt](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-unexpected-user-consent-prompt).

### Application Troubleshooting
1. When running sample application in local, to troubleshoot unexpected error response on APIs, you could use `stacktrace` present in the response.

2. When running the sample application in production e.g. Azure App Service, you can enable Application Insights to troubleshoot the Api failures in absence of application logs. 
   > (i) You can refer to [Enable Application Insights on App Service](https://docs.microsoft.com/azure/azure-monitor/app/azure-web-apps-net-core?tabs=Linux%2Cwindows#enable-monitoring) for enabling Application Insights on web application deployed on App Service.
   >
   > (ii) You can refer to [Analyze Failures](https://docs.microsoft.com/azure/azure-monitor/app/tutorial-runtime-exceptions#analyze-failures) on how to troubleshoot unexpected Api response. 

## Need Help

If you are are unable to find solution to the issue you are facing while running the sample on local or on production, you can use [Discussions Channel](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/discussions) to seek advise.

## Contributing

Join us by making a contribution. To get you started check out our [contribution guidelines](CONTRIBUTING.md).

We look forward to building an amazing open source Azure Communication Services Authentication server sample with you!

## Resources

- [Azure Communication Services Documentation](https://docs.microsoft.com/azure/communication-services/) - Find more about how to add voice, video, chat, and telephony on our official documentation.
- [Azure Communication Services Hero Samples](https://docs.microsoft.com/azure/communication-services/samples/overview) - Find more Azure Communication Services samples and examples on our samples overview page.
- [On-Behalf-Of workflow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) - Find more about the OBO workflow.
- [Creating a protected API](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) - Detailed example of creating a protected API.
- [Graph Open Extensions](https://docs.microsoft.com/graph/extensibility-open-users) - Find out more about Microsoft Graph open extensions.

## Trademark

**Trademarks** This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE.md)
