'use client'
import { useEffect, useState } from "react";

type UserInfo = {
  chat_id: number;
  first_name: string;
  last_name: string;
  username: string;
}

export default function TelegramUsers() {
  const [userData, setUserData] = useState<UserInfo[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/hello');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data.data || []);
      } catch (err) {
        console.log(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      userData.forEach((data) => {
        setChatId(data.chat_id);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUsername(data.username);
      });

      const postData = async () => {
        const resAppSheet = await fetch("/api/fetchAppSheetData?tableName=telegramuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId,
            firstName,
            lastName,
            username,
          }),
        });
        await resAppSheet.json();
      };
      postData();
    }
  }, [userData, chatId, firstName, lastName, username]);

//   useEffect(() => {
//   const updateUserData = async () => {
//     try {
//       const res = await fetch("/api/sendMessage", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           welcome:'Welcome to telegram',
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       console.log("Response:", data);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   updateUserData();
// }, []);

  return null;
}
