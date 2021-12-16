import { config as loadEnvVars } from "dotenv";
import { writeLog } from "fast-node-logger";
import type { NodeMode } from "./typings/node/mode";
import { createLoggerInstance, env } from "./helpers/util";
import { getToken } from "./services/auth";
import { getUsers, sendEmail } from "./services/fetch";
import {
  ConfidentialClientApplication,
  ClientCredentialRequest,
} from "@azure/msal-node";

/* place holder for execution time measuring **/
const hrstart = process.hrtime();

process.on("beforeExit", (code) => {
  const hrend = process.hrtime(hrstart);
  writeLog(`Execution time ${hrend[0]}s ${hrend[1] / 1000000}ms`, {
    level: "info",
    stdout: true,
  });
  writeLog(`exiting by code ${code}.`);
});

/** load process.env variables from .env file */
const result = loadEnvVars();
if (result.error) {
  throw new Error(`can't load the environment variables! ${result.error}`);
}

/** server mode base on process.env.NODE_ENV */
let nodeMode: NodeMode = process.env.NODE_ENV || "production";

if (process.env.NODE_ENV) {
  nodeMode = process.env.NODE_ENV;
}

(async () => {
  const logger = await createLoggerInstance(nodeMode);

  /**
   * Configuration object to be passed to MSAL instance on creation.
   * For a full list of MSAL Node configuration parameters, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
   */
  const msalConfig = {
    auth: {
      clientId: env("CLIENT_ID"),
      authority: `${env(`AAD_ENDPOINT`)}${env(`TENANT_ID`)}`,
      clientSecret: env("CLIENT_SECRET"),
    },
  };
  /**
   * Initialize a confidential client application. For more info, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
   */
  const cca = new ConfidentialClientApplication(msalConfig);

  /**
   * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
   * The scope is always in the format '<resource>/.default'. For more, visit:
   * https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
   */
  const tokenRequest: ClientCredentialRequest = {
    scopes: [env("GRAPH_ENDPOINT") + ".default"],
  };

  const apiConfig = {
    uri: env("GRAPH_ENDPOINT") + "v1.0/users",
  };

  const authResponse = await getToken({
    cca,
    clientCredentialRequest: tokenRequest,
  });
  if (authResponse) {
    const sendEmailResult = await sendEmail({
      accessToken: authResponse.accessToken,
      baseUrl: env("GRAPH_ENDPOINT"),
    });

    // const users = await getUsers({
    //   endpoint: apiConfig.uri,
    //   accessToken: authResponse?.accessToken,
    // });
    // console.log(users.value.length);
  }
})().catch((err) => {
  writeLog([err], { stdout: true, level: "error" });
});
