# Architecture Design

## Table of Contents

- [Overview](#overview)
- [Components](#components)
  - [Motivation for leveraging Graph Open Extensions for Identity Mapping](#motivation-for-leveraging-graph-open-extensions-for-identity-mapping)
- [Limitations](#limitations)
- [Guidance](#guidance)
- [Alternate Identity Mapping Approach](#alternate-identity-mapping-approach)
- [Other Helpful Links to Explore](#other-helpful-links-to-explore)

## Overview
This sample is primarily focused on building a Trusted Service for Azure Communication Services authentication. It is the Azure Communication Services Authentication Backend Server backed by Azure Active Directory as the Identity Provider and using open source libraries from [Microsoft Identity Platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview). The sample can be used directly if the below conditions are met, otherwise the sample needs to be adapted as described in our [Guidance section](#guidance):
- The sample supports single tenant use case. 
  >**Note:** You can verify the configuration through app registration used for user sign in flow for Azure Active Directory instance. Go to the specific app registration within Azure Active Directory through [Azure Portal](https://portal.azure.com/) and check the Authentication tab to verify the tenancy configuration.

- The sample only supports 1:1 identity mapping between Azure Active Directory user Id and Azure Communication Services user Id.

## Components
![Diagram](../images/ACS-Authentication-Server-Sample_Overview-Flow.png)

As seen from the overview diagram, the key components of the sample are:
1. [Secure Web API backed by Azure Active Directory](./secured-web-api-design.md)
2. [Identity Mapping leveraging Graph Open Extensions](./identity-mapping-design-graph-open-extensions.md)
3. Azure Communication Identity service which generates an Azure Communication Services identity and access tokens. The sample uses the [Azure Communication Services Identity SDK](https://docs.microsoft.com/azure/communication-services/concepts/sdk-options#sdks). 
>**Note:** The `api/token/teams` endpoint does not leverage #2, as the M365 Azure Active Directory Identity is internally mapped to user's Teams Identity within Azure Communication Services, see [Custom Teams Endpoint documentation](https://docs.microsoft.com/azure/communication-services/concepts/teams-endpoint).

### Motivation for leveraging Graph Open Extensions for Identity Mapping
The Azure Communication Services identity for the user could be co-located with the information for the Azure Active Directory user. This optimizes the complexity to maintain additional storage to keep mappings and instead enables developers to keep everything inside of Azure Active Directory.

## Limitations
- An application can add [at most two open extensions](https://docs.microsoft.com/graph/extensibility-overview#open-extension-limits) for an Azure Active Directory user. 
- Graph Open Extensions have a [rate limit](https://docs.microsoft.com/graph/throttling#open-and-schema-extensions-service-limits) of 455 requests per 10 seconds. 

## Guidance
!!!

1. !!! TODO: adapt to JS --> If 1:1 identity model of Azure Active Directory and Azure Communication Services in the sample does not meet your requirement, then you can consider adapting the [IdentityMappingModel class](https://github.com/Azure-Samples/communication-services-authentication-hero-csharp/blob/main/src/Models/IdentityMappingModel.cs) to handle multiple identity mappings.

!!!

2. Since Azure Communication Services is a data processor and you are the controller of the user data, you are responsible for ensuring the data privacy compliance. To learn more, please visit [Azure Communication Services privacy concept](https://docs.microsoft.com/azure/communication-services/concepts/privacy).
3. **For information of the users:** When the Azure Active Directory instance is used for 3rd party application sign in with [delegated permissions granted over Graph API](https://docs.microsoft.com/graph/auth/auth-concepts#delegated-and-application-permissions), the 3rd Party application with delegated permissions as `user.read` would also have access to the Azure Communication Services user Id persisted as open extension data of the user. This scenario is possible only if the sample is adapted for Multi Tenancy.
4. You as users of the sample would be data controllers of Azure Communication Services Identity and are hence responsible for handling GDPR compliance. The sample has `api/user` endpoints for user management and is provided as a way to handle Azure Communication Services Identity in the appropriate context. The DELETE `api/user` in sample for an example is responsible for deleting the Azure Communication Services Identity mapping in the Azure Active Directory.

## Alternate Identity Mapping Approach
If Graph Open Extensions does not meet your requirement for storage of Identity Mappings, you can consider storing them in databases such as [CosmosDB](https://docs.microsoft.com/azure/cosmos-db/) or [Azure Tables](https://docs.microsoft.com/azure/storage/tables/) for an example. You will need to make the below changes though:

1. Update the write and read operations in [graphService.ts](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/blob/main/src/services/graphService.ts) file.
2. Replace the usage of Graph `/me/extensions` endpoint with [`/me`](https://docs.microsoft.com/graph/api/resources/users?view=graph-rest-1.0) endpoint. The `/me` endpoint will get the M365 user ID in response as `id` attribute. This could be used as key to map the Azure Communication Services identity. The permissions for Graph API on server app registrations just needs to be reduced to `User.Read`.
3. Persist the mapping of Azure Communication Services identity to M365 user ID within the database of your choice.
4. Since the Azure Communication Services Identity is classified as EUPI(End User Pseudonymous Identifiers), please make sure all the required data privacy compliance are met on your end while the data is at rest and in transit. To learn more about how Azure Communication Services handles privacy, please visit [Azure Communication Services privacy concept](https://docs.microsoft.com/azure/communication-services/concepts/privacy).

## Other Helpful Links to Explore
- [Graph Apis](https://docs.microsoft.com/graph/use-the-api)
- [Example on how M365 handles data rentention policy](https://docs.microsoft.com/compliance/assurance/assurance-data-retention-deletion-and-destruction-overview#data-retention) to meet the Data Privacy requirements for different data category.
- [Microsoft Identity Platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview)
- [Azure Communication Services Documentation](https://docs.microsoft.com/azure/communication-services/)


**[Setting up for Local Development ...](<../deployment-guides/deploy-locally.md>)**
