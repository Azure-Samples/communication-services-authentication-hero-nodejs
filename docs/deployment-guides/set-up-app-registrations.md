# Set up App Registrations (For Secure Web API)

App Registrations are required to set up security on Web API using [On-Behalf-Of flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). The following setup walks you through steps required to create app registrations for the Azure Communication Services Authentication Server sample.

## [Set up App Registrations using script](../../AppCreationScripts/README.md)

You need to clone the repository for this step: https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs

```shell
# HTTPS
git clone https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs.git

# SSH
git clone git@github.com:Azure-Samples/communication-services-authentication-hero-nodejs.git
```

Once the script is run in local environment as instructed, the `AzureActiveDirectory` fields are updated in **src/appSettings.ts** from service app registration and `msalConfig.auth` fields are updated in **MinimalClient/src/authConfig.js** from client app registration in the cloned repository.

## Set up App Registrations manually

### Server App Registration

Follow instructions on how to register your server application with Azure Active Directory [here](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)

1. When registering your server app, use the following information:
   - give your application a meaningful name as this will be the displayed name of your app, for example `auther-server-sample-webApi`.
   - select the **Accounts in this organizational directory only (Microsoft only - Single tenant)** option for who can use or access this application.

   >**Note:** clicking on the **Register** button will open your application page once the registration is sucessful.

2. On the app's registration screen (**auther-server-sample-webApi** page):

   1. Navigate to and click on **Certificates & secrets** menu item on the left to open the page where you can generate secrets and upload certificates.

      1. In the **Client secrets** section, click on **New client secret** to create a new one.
      2. Type a key description (for instance `app secret`),
      3. Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security posture.
      4. The generated key value will be displayed when you click on the **Add** button. Copy the generated value for use in the steps later.
         >**Note:** You'll need this key later on in your code's configuration files. This key value will not be displayed again, and is not retrievable
         by any other means, so make sure to note it from the Azure portal before navigating to any other screen or page.

   2. Navigate to and click on **API permissions** menu item on the left to open the page where access to the APIs needed by your application will be defined.

      1. Click on **Add a permission**.
      2. Select **Microsoft Graph**.
      3. Select **Delegated permissions** for the type of permissions required by your app.
      4. On the permission list, scroll to **User** group and expand it, then check **User.Read** and **User.ReadWrite.All**.
      5. Now click on the **Add permissions** button at the bottom to save your permissions.
      6. Once the permissions are added, click on **Grant admin consent** for the Microsoft Graph API call.
      >**Note:** The 'Grant admin consent' step can only be performed by your Azure Active Directory Admin.

   3. Navigate to and click on the **Expose an API** menu item on the left to open the page where you can declare the parameters to expose this app as an API from which client applications can obtain the [access tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens).

      1. The first thing that you need to do is to declare the unique [resource](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow) URI that the clients will be using to obtain access tokens for this API. To declare a resource URI, follow the steps below:

         1. Select on `Set` next to the **Application ID URI** to generate an URI that is unique for this app.
         2. For this sample, accept the proposed Application ID URI (`api://{clientId}`) by clicking on the **Save** button.

      2. All APIs have to publish a minimum of one [scope](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-authorization-code) for the client to successfully obtain an access token. To publish a scope, click on the **Add a scope** button. This will open the **Add a scope** pane where you can defined your scope's values as indicated below:

         1. For **Scope name**, use `access_as_user`.
         2. For **Who can consent?** option, select **Admins and users**.
         3. For **Admin consent display name**, type `Access Microsoft Graph API`.
         4. For **Admin consent description**, type `Allows the app to access Microsoft Graph API as the signed-in user.`
         5. For **User consent display name**, type `Access Microsoft Graph API`.
         6. For **User consent description**, type `Allow the application to access Microsoft Graph API on your behalf.`
         7. Keep the **State** as **Enabled**.
         8. Click on the **Add scope** button at the bottom to save this scope.

   4. Navigate to and click on **Manifest** menu item on the left.

      1. In the editor, set `accessTokenAcceptedVersion` property to **2**.
      2. Click on **Save** on the top bar.

### Client App Registration

**Note** - This client app registration will be used to manually generate the Azure Active Directory Token required to call Azure Active Directory protected Web API as there is no client application in the sample.

Follow instructions on how to register your client application with Azure Active Directory [here](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app).

1. When registering your client app, use the following information:

   - give your application a meaningful name as this will be the displayed name of your app, for example `auther-server-sample-webClient`.
   - select the **Accounts in this organizational directory only (Microsoft only - Single tenant)** option for who can use or access this application.
   - set the **Redirect URI (optional)** with **Single-page Application (SPA)** as platform and `http://localhost:3000/` as URI. In case of manual generation of Azure Active Directory token for testing Auth Sample Apis, select **Web** as platform instead of **SPA**.

   >**Note:** clicking on the **Register** button will open your application page once the registration is sucessful.

2. On the app's registration screen (**auther-server-sample-webClient** page):

   1. Navigate to and click on **Certificates & secrets** menu item on the left to open the page where you can generate secrets and upload certificates.

      1. In the **Client secrets** section, click on **New client secret** to create a new one.
      2. Type a key description (for instance `app secret`),
      3. Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security posture.
      4. The generated key value will be displayed when you click on the **Add** button. Copy the generated value for use in the steps later.
         > Note: You'll need this key later on in your code's configuration files. This key value will not be displayed again, and is not retrievable 
         by any other means, so make sure to note it from the Azure portal before navigating to any other screen or page.

   2. Navigate to and click on **API permissions** menu item on the left to open the page where access to the APIs needed by your application will be defined.

      1. Click on **Add a permission**
      2. Ensure that the **My APIs** tab is selected.
      3. In the list of APIs, select the API `auther-server-sample-webApi`.
      4. In the **Delegated permissions** section, select `access_as_user` in the list. Use the search box if necessary.
      5. Now click on the **Add permissions** button at the bottom to save your permissions.
