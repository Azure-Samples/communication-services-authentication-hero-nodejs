# Docs

## Contribution Guides

Looking to make a contribution to this repo? Check out our guide for a walk-through on how to make your first contribution:

1. [Get Set up](<./contribution-guides/1. get-set-up.md>)
2. [Test Your Changes](<./contribution-guides/2. test-your-changes.md>)
3. [Write Unit Tests](<./contribution-guides/3. write-unit-tests.md>)
4. [Submit a PR](<./contribution-guides/4. submit-a-pr.md>)
5. [Publish Your Changes](<./contribution-guides/5. publish-your-changes.md>)

## Deployment Guides

Looking to deploy this sample? Check out our guides on how to deploy depending on your scenario:

- [Deploy on Azure](./deployment-guides/deploy-and-test-sample-on-azure.md)
- [Deploy Locally](./deployment-guides/deploy-locally.md)

Not sure how to register your apps on Azure? Checkout our [app registrations setup guide](./deployment-guides/set-up-app-registrations.md)

## Architecture Design Guides

- [Architecture Overview](design-guides/architecture-overview.md) - Overview of the Azure Communication Services Authentication Server sample design.
- [Endpoints and Responses](design-guides/endpoints-and-responses.md) - What are the endpoints and responses of the Azure Communication Services Authentication Server sample.
- [Identity Mapping Design](design-guides/identity-mapping-design-graph-open-extensions.md) - How to utilize the **Microsoft Graph Open Extensions** to manage Azure Communication Services identities by mapping them 1:1 with Microsoft Entra identities.
- [Secured Web API Design](./design-guides/secured-web-api-design.md) - How to protect Web API using the **Authentication Code Grant flow** (Client side excluded from the project) and secure an access token from the Microsoft identity platform using the **On-Behalf-Of flow** (Server side) to make authenticated requests to the downstream services.
- [Token Exchange Design](./design-guides/token-exchange-design.md) - Overview on how the authentication and Microsoft Entra token exchange flow should be implemented using Azure Communication Services sdk to enable M365 users to join Teams meeting as authenticated Team users.
