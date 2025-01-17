import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  error?: string;
  data?: {
    chat_id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const apiKey = "7786727966:AAENBDXFKdVcYAPYkKFkpEta2-UlvoyB1q0";
  const endPoint = `https://telegram.rest/bot${apiKey}/getUpdates`;

  try {
    const response = await fetch(endPoint, {
      method: "POST", // Explicit method definition
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.statusText} (Status Code: ${response.status})`
      );
    }

    const data = await response.json();

    // Extract chat_id, first_name, last_name, and username from the message object
    type Message = {
      message: {
        chat: {
          id: number;
        };
        from: {
          first_name: string;
          last_name: string;
          username: string;
        };
      };
    };

    const userInfo = data.result.map((message: Message) => ({
      chat_id: message.message.chat.id,
      first_name: message.message.from.first_name,
      last_name: message.message.from.last_name,
      username: message.message.from.username,
    }));

    res.status(200).json({ data: userInfo });
  } catch (error) {
    console.error("Error details:", error); // Log the full error for debugging
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
