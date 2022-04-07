import { chatwork } from "./chatwork";
import template from "./template";
import environments from "./environments.json";

// 問い合わせフォーム
interface ContactForm {
  タイムスタンプ: string;
  お問い合わせ種類: string;
  問い合わせ内容: string;
}

export async function notify({ namedValues }: { namedValues: ContactForm }) {
  const { sendMessage } = chatwork();
  await sendMessage(environments.CHATWORK_ROOM_ID, template(namedValues));
}
