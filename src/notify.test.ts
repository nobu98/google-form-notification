import * as client from "./chatwork";
import { notify } from "./notify";

jest.mock(
  "./environments.json",
  () => ({
    CHATWORK_ROOM_ID: "room1",
  }),
  { virtual: true }
);

describe(notify.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  }),
    it("メッセージ送信チェック: 正常系", async () => {
      const chatwork = jest.spyOn(client, "chatwork");
      const sendMessage = jest.fn();
      sendMessage.mockResolvedValue({ message_id: "xxx" });
      chatwork.mockReturnValue({ sendMessage });
      await notify({
        namedValues: {
          タイムスタンプ: "2022/04/01 01:23:45",
          お問い合わせ種類: "ログインについて",
          問い合わせ内容:
            "IDとパスワードを忘れてしまったのですが\nどうしたらよいですか？",
        },
      });
      expect(sendMessage).toBeCalledTimes(1);
      expect(sendMessage).toBeCalledWith(
        "room1",
        "タイムスタンプ: 2022/04/01 01:23:45\n" +
          "お問い合わせ種類: ログインについて\n" +
          "問い合わせ内容:\n" +
          "IDとパスワードを忘れてしまったのですが\n" +
          "どうしたらよいですか？\n"
      );
    });
  it("メッセージ送信チェック: 異常系", async () => {
    const chatwork = jest.spyOn(client, "chatwork");
    const sendMessage = jest.fn();
    const notificationError = new client.NotificationError();
    sendMessage.mockRejectedValue(notificationError);
    chatwork.mockReturnValue({ sendMessage });
    try {
      await notify({
        namedValues: {
          タイムスタンプ: "",
          お問い合わせ種類: "",
          問い合わせ内容: "",
        },
      });
    } catch (error) {
      expect(error).toBe(notificationError);
    }
  });
});
