import { chatwork } from "./chatwork";
import template from "./template";

// 問い合わせフォーム
interface ContactForm {
  タイムスタンプ: string;
  お問い合わせ種類: string;
  問い合わせ内容: string;
}
// const ROOM_ID = 267268538;
// const API_TOKEN = "bc5ed2fd88bce6772be2922d828ce90a";

export async function notify({ namedValues }: { namedValues: ContactForm }) {
  if (!process.env.CHATWORK_ROOM_ID)
    throw Error("ルームIDが指定されていません。");
  const { sendMessage } = chatwork();
  await sendMessage(process.env.CHATWORK_ROOM_ID, template(namedValues));
}
