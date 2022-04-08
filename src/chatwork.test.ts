import { mockDeep } from "jest-mock-extended";
import { chatwork, NotificationError } from "./chatwork";

jest.mock(
  "./environments.json",
  () => ({
    CHATWORK_API_TOKEN: "hoge",
  }),
  { virtual: true }
);

describe(chatwork.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  }),
    it("チャット投稿: 正常系", async () => {
      UrlFetchApp.fetch = jest.fn(() => response);
      const response = mockDeep<GoogleAppsScript.URL_Fetch.HTTPResponse>();
      response.getContentText.mockReturnValue('{"message_id":"abcde"}');
      const { sendMessage } = chatwork();
      const result = sendMessage("room_id", "message text");
      expect(global.UrlFetchApp.fetch).toBeCalledTimes(1);
      expect(global.UrlFetchApp.fetch).toBeCalledWith(
        "https://api.chatwork.com/v2/rooms/room_id/messages?body=message%20text",
        {
          method: "post",
          headers: {
            "X-ChatWorkToken": "hoge",
          },
        }
      );
      expect(result).toEqual({ message_id: "abcde" });
    });
  it("チャット投稿: 異常系", async () => {
    UrlFetchApp.fetch = jest.fn(() => {
      throw new Error();
    });
    const { sendMessage } = chatwork();
    try {
      sendMessage("room_id", "message text");
    } catch (error) {
      if (!(error instanceof NotificationError)) throw Error();
      expect(error instanceof NotificationError).toBeTruthy();
      expect(error.message).toBe(
        "Chatworkのフォーム通知(ルームID: room_id)に失敗しました。"
      );
    }
  });
});
