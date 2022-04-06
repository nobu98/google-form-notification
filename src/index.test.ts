import * as client from "./chatwork";
import { notify } from "./index";

describe(notify.name, () => {
  beforeEach(() => {
    delete process.env.CHATWORK_ROOM_ID;
    jest.clearAllMocks();
  }),
    it("初期化チェック: ENV値なし", async () => {
      const chatwork = jest.spyOn(client, "chatwork");
      const sendMessage = jest.fn();
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
        expect((error as Error).message).toBe("ルームIDが指定されていません。");
        expect(sendMessage).toBeCalledTimes(0);
      }
    });
  it("メッセージ送信チェック: 正常系", async () => {
    process.env.CHATWORK_ROOM_ID = "room1";
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
    process.env.CHATWORK_ROOM_ID = "room1";
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
