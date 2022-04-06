import { chatwork } from "./chatwork";
import template from "./template";

// 問い合わせフォーム
interface ContactForm {
  タイムスタンプ: string;
  お問い合わせ種類: string;
  問い合わせ内容: string;
}

export async function notify({ namedValues }: { namedValues: ContactForm }) {
  if (!process.env.CHATWORK_ROOM_ID)
    throw Error("ルームIDが指定されていません。");
  const { sendMessage } = chatwork();
  await sendMessage(process.env.CHATWORK_ROOM_ID, template(namedValues));
}
