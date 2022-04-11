import ExtensibleCustomError from "extensible-custom-error";
import environments from "./environments.json";

export class NotificationError extends ExtensibleCustomError {}

// FIXME: 外に出したい気がする・・・
const UserId = {
  "杉本 康太さん": 111111,
};

export const chatwork = (
  baseURL = "https://api.chatwork.com/v2",
  token = environments.CHATWORK_API_TOKEN
) => {
  const sendMessage = (
    roomId: string,
    body: string,
    mensiton: Array<string> = []
  ) => {
    try {
      const response = UrlFetchApp.fetch(
        `${baseURL}/rooms/${roomId}/messages?body=${encodeURIComponent(body)}`,
        {
          method: "post",
          headers: {
            "X-ChatWorkToken": token,
          },
        }
      );
      return JSON.parse(response.getContentText()) as { message_id: string };
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
