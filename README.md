# MS Graph API send mail with client credential example

# How to use

1. clone the repository
1. add a `.env` file in root directory of your project with content below:

```
# Credentials
TENANT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Endpoints
AAD_ENDPOINT=https://login.microsoftonline.com/
GRAPH_ENDPOINT=https://graph.microsoft.com/
```

## Resources that I used

- https://github.com/microsoftgraph/msgraph-sdk-javascript/tree/c4628151c39c4922e334bcd68f23580bf453cbee#via-npm
- https://docs.microsoft.com/en-us/graph/auth-v2-service?context=graph%2Fapi%2F1.0&view=graph-rest-1.0
- https://developer.microsoft.com/en-us/graph/graph-explorer
- https://github.com/Azure-Samples/ms-identity-javascript-nodejs-console
- https://docs.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0&tabs=javascript

## Notice

the only functionality that I couldn't get to work is attaching .zip file, I think solution for that is to create a draft message first and in another request, attach the .zip file to existing message and later send it.
