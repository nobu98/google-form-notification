import axios from "axios";
import ExtensibleCustomError from "extensible-custom-error";

export class NotificationError extends ExtensibleCustomError {}

export const chatwork = (
  baseURL = "https://api.chatwork.com/v2",
  token = process.env.CHATWORK_API_TOKEN || ""
) => {
  if (!token) throw new Error("API TOKENが指定されていません。");
  const client = axios.create({
    baseURL,
    headers: {
      "X-CHatWork-Token": token,
    },
    timeout: 1000,
  });

  const sendMessage = async (roomId: string, body: string) => {
    try {
      const response = await client.post<{ message_id: string }>(
        `${roomId}/messages`,
        undefined,
        {
          params: { body },
        }
      );
      return response.data;
    } catch (error) {
      throw new NotificationError(
        `Chatworkのフォーム通知(ルームID: ${roomId})に失敗しました。`,
        error as Error
      );
    }
  };

  return {
    sendMessage,
  };
};
