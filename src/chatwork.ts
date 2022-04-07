import axios from "axios";
import adapter from "axios/lib/adapters/xhr";
import ExtensibleCustomError from "extensible-custom-error";
import environments from "./environments.json";

export class NotificationError extends ExtensibleCustomError {}

export const chatwork = (
  baseURL = "https://api.chatwork.com/v2",
  token = environments.CHATWORK_API_TOKEN
) => {
  // hack: https://github.com/axios/axios/issues/2968
  const client = axios.create({
    adapter, // https://github.com/axios/axios/issues/2968
    baseURL,
    headers: {
      "X-ChatWorkToken": token,
    },
    timeout: 1000,
  });

  const sendMessage = async (roomId: string, body: string) => {
    try {
      const response = await client.post<{ message_id: string }>(
        `/rooms/${roomId}/messages`,
        undefined,
        {
          params: { body: body },
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
