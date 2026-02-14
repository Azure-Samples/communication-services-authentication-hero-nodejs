# Manually generating Microsoft Entra Token to test secure Azure Communication Services Authentication Server Sample Apis

**Attention:** Before using this testing approach, please navigate to `auther-server-sample-webClient` app registration on [Azure Portal](https://portal.azure.com); further navigate to **Manifest** and make sure that `replyUrlsWithType[].type` is set to `Web`. If not updated, please update it.

**Note:** The `<client app id>` is the application id of the client app registration (`auther-server-sample-webClient`) referred in the below requests. 
The client app in those requests generally refers the client app registration. You can get the `<tenantid>` from the app registration **Overview** page as well. 
You can get the `<redirect_uri from client app>` by navigating to **Authentication** page of the client app registration. You can get `<server api scope>` by navigating to the **Expose an Api** page of server app registartion and expanding the added scope.
The full scope name of the server API should be used for the scope parameter in the below requests (e.g.: "api://1234-5678-abcd-efgh...../access_as_user").
To learn more about manual generation of Microsoft Entra Token, please refer to [Get Microsoft Entra Tokens by using web browser and curl](https://docs.microsoft.com/azure/databricks/dev-tools/api/latest/aad/app-aad-token#get-azure-ad-tokens-by-using-a-web-browser-and-curl).

1. You will need an access token using client app registration to call the API. In order to get the access token, open your browser in private mode and visit the link below. 

```
https://login.microsoftonline.com/<tenantid>/oauth2/v2.0/authorize?response_type=code&client_id=<client appid>&redirect_uri=<redirect_uri from client app>&scope=<server api scope>
```

2. This will prompt you to perform authentication and consent, and it will return a code (which is short lived for 10 minutes) and session_state in the query string. Use that `code` and `session_state` in the following request to get an access token.

```shell
curl --location --request POST 'https://login.microsoftonline.com/<tenantid>/oauth2/v2.0/token' \
--header 'Accept: */*' \
--header 'Cache-Control: no-cache' \
--header 'Connection: keep-alive' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Host: login.microsoftonline.com' \
--header 'accept-encoding: gzip, deflate' \
--header 'cache-control: no-cache' \
--data-urlencode 'redirect_uri=<redirect_uri from client app>' \
--data-urlencode 'client_id=<client appid>' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'code=<add code here>' \
--data-urlencode 'session_state=<session_state>' \
--data-urlencode 'client_secret=<secret generated in client app registration>' \
--data-urlencode 'scope=<server api scope>'
```

> Note: If you are facing issues running the curl command, then try importing (File -> import -> raw text, paste the curl command and continue) the curl command in [Postman](https://www.postman.com/downloads/) and running it there.
