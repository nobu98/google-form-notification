import axios, { AxiosInstance } from "axios";
import { mockDeep } from "jest-mock-extended";
import { chatwork, NotificationError } from "./chatwork";

describe(chatwork.name, () => {
  beforeEach(() => {
    delete process.env.CHATWORK_API_TOKEN;
    jest.clearAllMocks();
  }),
    it("初期化チェック: パラメータ指定なし/ENV値なし", () => {
      const create = jest.spyOn(axios, "create");
      expect(() => chatwork()).toThrow("API TOKENが指定されていません。");
      expect(create).toBeCalledTimes(0);
    });
  it("初期化チェック: パラメータ指定なし/ENV値あり", () => {
    process.env.CHATWORK_API_TOKEN = "hoge";
    const create = jest.spyOn(axios, "create");
    chatwork();
    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith({
      baseURL: "https://api.chatwork.com/v2",
      headers: {
        "X-CHatWork-Token": "hoge",
      },
      timeout: 1000,
    });
  });
  it("初期化チェック: パラメータ指定あり", () => {
    const create = jest.spyOn(axios, "create");
    chatwork("https://api.chatwork.com/v1", "fuga");
    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith({
      baseURL: "https://api.chatwork.com/v1",
      headers: {
        "X-CHatWork-Token": "fuga",
      },
      timeout: 1000,
    });
  });
  it("チャット投稿: 正常系", async () => {
    process.env.CHATWORK_API_TOKEN = "hoge";
    const create = jest.spyOn(axios, "create");
    const instance = mockDeep<AxiosInstance>();
    instance.post.mockResolvedValue({ data: { message_id: "ABCDE" } });
    create.mockReturnValue(instance);
    const { sendMessage } = chatwork();
    const result = await sendMessage("room", "message text");
    expect(instance.post).toBeCalledWith("room/messages", undefined, {
      params: { body: "message text" },
    });
    expect(result.message_id).toBe("ABCDE");
  });
  it("チャット投稿: 異常系", async () => {
    process.env.CHATWORK_API_TOKEN = "hoge";
    const create = jest.spyOn(axios, "create");
    const instance = mockDeep<AxiosInstance>();
    const axiosError = new Error();
    instance.post.mockRejectedValue(axiosError);
    create.mockReturnValue(instance);
    const { sendMessage } = chatwork();
    try {
      await sendMessage("room", "message text");
    } catch (error) {
      if (!(error instanceof NotificationError)) throw Error();
      expect(error instanceof NotificationError).toBeTruthy();
      expect(error.message).toBe(
        "Chatworkのフォーム通知(ルームID: room)に失敗しました。"
      );
    }
  });
});
