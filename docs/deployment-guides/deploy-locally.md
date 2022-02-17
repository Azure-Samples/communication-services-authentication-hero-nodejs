# Deploy Locally

1. [Get Set up](#get-set-up)
   1. [Prerequisites for Development Environment Setup](#prerequisites-for-development-environment-setup)
   2. [Cloning the repo](#cloning-the-repo)
   2. [Installing dependencies](#installing-dependencies)
2. [Build Authentication Server Sample](#build-authentication-server-sample)
3. [Run Authentication Server Sample](#run-authentication-server-sample)
   1. [Prerequisites to run the sample](#prerequisites-to-run-the-sample)
   2. [Update the appSettings.ts file](#update-the-appsettingsts-file)
   3. [Generate an Azure Active Directory Token Manually](#generate-an-azure-active-directory-token-manually)
   4. [Run the App](#run-the-app)

## Get Set up

### Prerequisites for Development Environment Setup

- Install [Node.js](https://nodejs.org/en/download/).
- (Recommended) Install [Visual Studio Code (Stable Build)](https://code.visualstudio.com/Download).

### Cloning the repo

Clone the repo: https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs

```shell
# HTTPS
git clone https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs.git

# SSH
git clone git@github.com:Azure-Samples/communication-services-authentication-hero-nodejs.git
```

### Installing dependencies

Navigate to the project directory and install dependencies for all packages and samples:

```shell
# Navigate to the repository
cd communication-services-authentication-hero-nodejs/

# Install dependencies
npm install
```

>**Note:** this may take some time the first time it runs

## Build Authentication Server Sample

After installing all necessary dependencies, you can run the following command to build the repo.

```shell
# this command equals to npm run prettier && npm run lint:fix && npm run build-tsc
npm run build
```

This command consists of three sub-commands:

1. `npm run prettier` - Formats code to ensure that all outputted code conforms to a consistent style defined in the `.prettierrc.json` file.
2. `npm run lint:fix` - Instructs ESLint to try to fix issues which break what the `.eslintrc.js` file defines.
3. `npm run build-tsc` - Compiles TypeScript files.

>**Note:**
>
> 1. This may take some time the first time it runs.
> 2. More scripts are available for this repo, to see the full list, please check `scripts` section in the `package.json` file.

## Run Authentication Server Sample

### Prerequisites to run the sample
To be able to run this sample locally, you will first need to follow those [prerequisites](../../README.md#prerequisites).

### Update the `appSettings.ts` File

Before running the sample, you will need to replace the values in the  `appSettings.ts` file:

1. Replace `connectionString` and `scopes` for the Communication Services
2. Replace `clientId`, `tenantId` and `clientSecret` for the Azure Active Directory.

>**Note:** Values of `clientId`, `tenantId` and `clientSecret` are all from your `auther-server-sample-webApi`. If you created the app registrations in [prerequisites](#prerequisites-to-run-the-sample) using app creation scripts, then you should already have these values updated in your local repository.

### Run the App

In order to run the Azure Communication Services Authentication Server sample,

1. Go to the project root directory.

   ```shell
   # navigate to the repository
   cd communication-services-authentication-hero-nodejs/
   ```

2. Run the following command.

   ```shell
   # Start the server
   npm run start
   ```

3. We have two ways of testing the backend service
   - Using a manually generated token and calling the server directly
   - Using a sample client

   Please see the two options in detail here. [Test deployed service](../test-tools/test-backend-service.md).

   Here is a set of endpoints that can be tested. [API Endpoints](../design-guides/endpoints-and-responses.md). 

   For testing with the client, we currently use the `GET /api/token`, and `POST /api/user` endpoints.

4. During local development/testing, if the identity mapping needs to be verified in Graph for `/api/user` and `/api/token` endpoint, please use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Sign in with your Azure Active Directory Identity and verify the response on GET `https://graph.microsoft.com/v1.0/me/extensions` endpoint.

>**Note:** Want to contribute to this sample and help us make it even better? Check our [contribution guide](../contribution-guides/1.get-set-up.md).
