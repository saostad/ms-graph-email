import axios, { AxiosRequestConfig } from "axios";
import { readFileSync } from "fs";

type GetUsersInput = { endpoint: string; accessToken: string };

type GetUsersOutput = {
  "@odata.context": string;
  "@odata.nextLink": string;
  value: Record<string, any>[];
};

export async function getUsers({
  endpoint,
  accessToken,
}: GetUsersInput): Promise<GetUsersOutput> {
  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  console.log("request made to web API at: " + new Date().toString());

  const response = await axios.get(endpoint, options);
  return response.data;
}

type SendEmailInput = { accessToken: string; baseUrl: string };

export async function sendEmail({ accessToken, baseUrl }: SendEmailInput) {
  const csvFile = readFileSync("./data/file.csv", {
    encoding: "base64",
  });
  const imageFile = readFileSync("./data/file.png", {
    encoding: "base64",
  });
  const pdfFile = readFileSync("./data/file.pdf", {
    encoding: "base64",
  });
  const xlsxFile = readFileSync("./data/file.xlsx", {
    encoding: "base64",
  });

  const data = JSON.stringify({
    message: {
      subject: "Meet for lunch?",
      body: {
        contentType: "Text",
        content: "The new cafeteria is open.",
      },
      toRecipients: [
        {
          emailAddress: {
            address: "sostad@kajimausa.com",
          },
        },
      ],
      attachments: [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: "attachment.csv",
          contentType: "base64",
          contentBytes: csvFile,
        },
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: "attachment.png",
          contentType: "base64",
          contentBytes: imageFile,
        },
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: "attachment.pdf",
          contentType: "base64",
          contentBytes: pdfFile,
        },
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: "attachment.xlsx",
          contentType: "base64",
          contentBytes: xlsxFile,
        },
      ],
    },
  });

  const options: AxiosRequestConfig = {
    method: "post",
    url: `${baseUrl}v1.0/users/notifications@kajimausa.com/sendMail`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data,
  };

  const response = await axios(options);
  console.log(
    `File: fetch.ts,`,
    `Line: 57 => `,
    response.status,
    response.statusText,
  );

  return response.data;
}
