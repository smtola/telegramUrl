import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = "7786727966:AAENBDXFKdVcYAPYkKFkpEta2-UlvoyB1q0";

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { welcome } = req.body;


  const message = `
    📦 *New Product Information* 📦
    - 📇 *Customer Name:* ${welcome}
    }
    `;

  const url = `https://telegram.rest/bot${apiKey}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: 5687548307,
        text: message,
        parse_mode: "Markdown", // Enables formatting
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ message: errorData.description });
    }

    const data = await response.json();
    return res.status(200).json({ message: "Message sent successfully", data });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return res.status(500).json({ message: "Failed to send message", error });
  }
}
