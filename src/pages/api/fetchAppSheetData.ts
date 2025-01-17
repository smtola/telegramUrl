import { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  error: string;
}

interface AppSheetResponse {
  Rows: unknown[]; // Rows as an array of unknown type
  Properties?: unknown; // Optional Properties of unknown type
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AppSheetResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tableName } = req.query;
  const {chatId, firstName, lastName, username } = req.body;

  // Validate tableName type
  if (typeof tableName !== "string") {
    return res.status(400).json({ error: "Invalid tableName parameter" });
  }

  const apiKey = "V2-bedoc-zQJfc-kp24x-XY1Ra-GhbZb-HJAu1-Omcjh-NRTj8";
  if (!apiKey) {
    return res.status(500).json({ error: "Missing AppSheet API key" });
  }

  const appId = "fe577f98-dece-4b87-8391-7307ca172c32";
  const endPoint = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/query`;

  try {
    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        applicationAccessKey: apiKey,
      },
      body: JSON.stringify({
        Action: "Add",
        Properties: {
          Locale: "en-US",
          Timezone: "UTC",
        },
        Rows: [
          {
            chatId: chatId,
            firstName: firstName,
            lastName: lastName,
            username: username,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.statusText} (Status Code: ${response.status})`
      );
    }

    const data: AppSheetResponse = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
