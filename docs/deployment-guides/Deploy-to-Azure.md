## Deploy to Azure and Configuration

1. Follow the button [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fcommunication-services-authentication-hero-nodejs%2Fmain%2Fdeploy%2Fazuredeploy.json) to deploy to Azure through [ARM template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview). The template provisions an instance of Communication Services and App Service with deployed code. 

2. Once the deployment is completed successfully, a few configurations need to be updated on Application Settings within APP Service using the information from server app registrations. Edit the values of following keys by visiting the server app registration:

```
"AzureActiveDirectory__ClientId": "<Application Id from 'Overview page of the server app>"

"AzureActiveDirectory__ClientSecret": "<Client Secret Value from 'Certifactes & secrets' of server app>"

"AzureActiveDirectory__TenantId": "<Tenant Id from 'Overview' page of the server app>"
```


## Custom deployment for contribution 

The contribution is welcomed as long as the action meets our [Contribution Guides](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/tree/main/docs/contribution-guides), but testing API locally does not guarantee a successful running on Azure. Before submitting a PR to the repo, we highly recommend users to deploy their updated code by themselves and test the API. The steps of deployment are listed below:

1. Download the repo, and make your own implementations. 

2. Before building package based on your local updated code, make sure the `/dist` is remove first, and then run the npm script at root directory:

    ```bash
    npm run prod
    ```

3. Zip the `/dist` folder.

4. Log in your Azure portal, create an storage account under the target resource group, then build a new container under this storage account, upload the zipped folder to the container and copy its URL

5. Go back to the Azure home page, select the option `Deploy from a custom template` and click on `Build your own template in editor`. In this step, you can copy the ARM template file from `deploy/azuredeploy.json` and paste it on the input field, but replace the `packageURL.default` with the URL of zipped folder in your Azure storage blob. Then, follow the instructions and complete the deployment of your custom authentication sample. 