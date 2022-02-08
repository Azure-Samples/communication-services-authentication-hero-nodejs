# Enpoints and Responses

## User Endpoint

The `/user` endpoint consists of three operations:

1. **GET** - Retrieve an Azure Communication Services identity from Microsoft Graph.
2. **POST** - Create an Azure Communication Services identity and then add the roaming identity mapping information to Microsoft Graph.
3. **DELETE** - Delete an identity mapping information from Microsoft Graph including the Azure Communication Services resource related to the Azure Communication Services identity.

## Token Endpoint

The `/token/aad` endpoint only consists of two operations:

1. **GET /token** - Get / refresh an Azure Communication Services token for an Azure Communication Services user.
2. **GET /token/teams** - Exchange an Azure Active Directory token of a M365 user for an Azure Communication Services token.

> :information_source: Teams users are authenticated via the MSAL library against Azure Active Directory in the client application. Authentication tokens are exchanged for Microsoft 365 Teams token via the Azure Communication Services Identity SDK. Developers are encouraged to implement an exchange of tokens in their backend services as exchange requests are signed by credentials for Azure Communication Services. In backend services, developers can require any additional authentication. Learn more [here](https://docs.microsoft.com/en-ca/azure/communication-services/concepts/teams-interop#microsoft-365-teams-identity).

![Identity Mapping - Disassembly Diagram](../images/ACS-Authentication-Server-sample_Identity-Mapping_Disassembly-Diagram.png)
