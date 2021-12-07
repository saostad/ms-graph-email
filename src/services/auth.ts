import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
} from "@azure/msal-node";

type GetTokenInput = {
  /** client credential application */
  cca: ConfidentialClientApplication;
  clientCredentialRequest: ClientCredentialRequest;
};

export async function getToken({
  cca,
  clientCredentialRequest,
}: GetTokenInput) {
  return await cca.acquireTokenByClientCredential(clientCredentialRequest);
}
