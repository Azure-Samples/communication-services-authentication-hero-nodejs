# Deploy & Test sample on Azure

1. Set up App Registrations

   To register your Client and Server applications, please refer to our [registrations set up guideline](./set-up-app-registrations.md)

2. Deploy to Azure

    1. Follow the button [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fcommunication-services-authentication-hero-nodejs%2Fmain%2Fdeploy%2Fazure-deploy.json) to deploy to Azure through [Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview).

    2. The template provisions an instance of Communication Services and App Service with deployed code.

    3. When the deployment is completed successfully, a few configurations need to be updated on Application settings within Azure App Service using the information from server app registration. You can refer to the [Configure Common Settings page](https://docs.microsoft.com/azure/app-service/configure-common?tabs=portal) to update Application settings within Azure App Service.

        Edit the values of following keys by visiting the server app registration:
        > **Note** If you created the app regsitrations using scripts, then the `AzureActiveDirectory` configuration values could be found from **src/appSettings.ts** file within your locally cloned repository.

       - `AzureActiveDirectory__ClientId`: "<Application Id from 'Overview page of the server app>"

       - `AzureActiveDirectory__ClientSecret`: "<Client Secret Value from 'Certifactes & secrets' of server app>"

       - `AzureActiveDirectory__TenantId`: "<Tenant Id from 'Overview' page of the server app>"

       - Record the value of `CommunicationServices__ConnectionString` from automatically created Azure Communication Services resource after first deployment to use for subsequent deployments, if you plan to deploy the sample through Azure Resource Manager Template multiple times.

    > :bangbang: For the multiple deployments of the sample, there could be an error of "mismatched Azure Communication Services Identity not belonging to the Azure Communication Services resource" while invoking `/api/token` or `/api/user` endpoints and using same Azure Active Directory user account for signing in on client side. The issue would happen since the Azure Communication Services Identity is specific to an Azure Communication Services resource. So if a different Azure Communication Services resource is used within subsequent deployments (**Note:** The aforementioned Azure Resource Manager template deployment always creates new resources including Azure Communication Services), the persisted Azure Communication Services Identity within Azure Active Directory user instance will not match the Azure Communication Services resource for Azure Active Directory user account. For more information regarding Identity Mapping you can visit [Identity Mapping Design](../design-guides/identity-mapping-design-graph-open-extensions.md). **So, please make sure to use the `ConnectionString` from the same Azure Communication Services in all the deployments if using the same Azure Active Directory instance to sign in**.

    **Recommendations**

    1. For subsequent deployments, swap the "CommunicationServices__ConnectionString" within Application Settings of newly deployed App Service from App Service of earlier created deployment or connection string of any manually created Azure Communication Services used in prior deployments.

    2. You can also follow the Troubleshooting section on [README](../../README.md) to resolve the issue of Mismatched Azure Communication Services Identity and Azure Communication Services resource.

3. We have two ways of testing the backend service
   - Using a manually generated token and calling the server directly
   - Using a sample client

   Please see the two options in detail here. [Test deployed service](../test-tools/test-backend-service.md).

   Here is a set of endpoints that can be tested. [API Endpoints](../design-guides/endpoints-and-responses.md). 

   For testing with the client, we currently use the `GET /api/token`, and `POST /api/user` endpoints.

**[Proceed to Architecture Overview ...](../design-guides/architecture-overview.md)**

**[Setting up for Local Development ...](./deploy-locally.md)**
