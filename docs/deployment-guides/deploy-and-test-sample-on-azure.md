# Deploy & Test sample on Azure

1. Set up App Registrations

   To register your Client and Server applications, please refer to our [registrations set up guideline](./set-up-app-registrations.md)

2. Deploy to Azure

    1. Follow the button [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fcommunication-services-authentication-hero-csharp%2Fmain%2Fdeploy%2Fazuredeploy.json) to deploy to Azure through [Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview).

    2. The template provisions an instance of Communication Services and App Service with deployed code.

    3. When the deployment is completed successfully, a few configurations need to be updated on Application settings within App Service using the information from server app registration.

        Edit the values of following keys by visiting the server app registration:

       - `AzureActiveDirectory__ClientId`: "<Application Id from 'Overview page of the server app>"

       - `AzureActiveDirectory__ClientSecret`: "<Client Secret Value from 'Certifactes & secrets' of server app>"

       - `AzureActiveDirectory__TenantId`: "<Tenant Id from 'Overview' page of the server app>"

       - Record the value of `CommunicationServices__ConnectionString` for subsequent deployments, if you plan to deploy the sample through Azure Resource Manager Template multiple times.

    > :bangbang: For the multiple deployments of the sample using the above Azure Resource Manager template, there could be an error of "mismatched Azure Communication Services Identity not belonging to the Azure Communication Services resource" while invoking `/api/token` or `/api/user` endpoints and using same Azure Active Directory user account for signing in on client side. The issue would happen since the Azure Communication Services Identity is specific to an Azure Communication Services resource. So if a different Azure Communication Services resource is used within subsequent deployments(**Note:** The aforementioned Azure Resource Manager template deployment always creates new resources including Azure Communication Services), the persisted Azure Communication Services Identity within Azure Active Directory user instance will not match the Azure Communication Services resource for Azure Active Directory user account. For more information regarding Identity Mapping you can visit [Identity Mapping Design](../design-guides/identity-mapping-design-graph-open-extensions.md)

    **Recommendations**

    1. For subsequent deployments, swap the "CommunicationServices__ConnectionString" within Application Settings of newly deployed App Service from App Service of earlier created deployment or connection string of any manually created Azure Communication Services used in prior deployments.

    2. You can also follow the Troubleshooting section on [README](../../README.md) to resolve the issue of Mismatched Azure Communication Services Identity and Azure Communication Services resource.

3. Test the deployed APIs

    a. Testing with manually generated Azure Active Directory Token

     - [Generate Azure Active Directory token manually](../test-tools/generate_aad_token_manually.md) to call secure Apis of Azure Communication Services Authentication Hero sample.

     - Invoke the API
        Once you get the access token, make a GET request to `/api/token` endpoint with the access token as a Authorization Bearer header. Verify you get a successful status code i.e. 200.

        ```shell
        curl --location --request GET 'http://<replace with URL on your provisioned App Service>/api/token' \

        --header 'Authorization: Bearer <put access token here>
        ```
    
    b. Test the APIs using Test Client (To Be discussed...) 


**[Proceed to Architecture Overview ...](../design-guides/architecture-overview.md)**

**[Setting up for Local Development ...](./deploy-locally.md)**
