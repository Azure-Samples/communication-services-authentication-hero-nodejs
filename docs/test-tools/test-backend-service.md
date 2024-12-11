# Test deployed service

1. Testing Backend APIs directly with an Microsoft Entra Token

    - [Generate Microsoft Entra token (Refer to steps 1 - 5)](../../MinimalClient/README.md) to call secure Apis of Azure Communication Services Authentication Hero sample.

        - [You can also generate a token without a client if you prefer.](../test-tools/generate-aad-token-manually.md) *Note that this process can have some complexities setting it up the first time.

    - Invoke the API
    Once you get the access token, make a GET request to `/api/token` endpoint with the access token as a Authorization Bearer header. Verify you get a successful status code (i.e. 200).

        ```shell
        curl --location --request GET 'https://<replace with URL on your provisioned App Service>/api/token  OR http://localhost:5000/api/token' \

        --header 'Authorization: Bearer <put access token here>'
        ```
        > Note: If you are facing issues running the curl command, then try importing (File -> import -> raw text, paste the curl command and continue) the curl command in [Postman](https://www.postman.com/downloads/) and running it there

2. Test the APIs using the MinimalClient (This will test the `GET /api/token`, and `POST /api/user` endpoints)
    -  Please take a look at the MinimalClient README.md [MinimalClient](../../MinimalClient/README.md)