import { chatwork } from "./chatwork";
import template from "./template";
import environments from "./environments.json";

// 問い合わせフォーム
interface ContactForm {
  タイムスタンプ: string;
  お問い合わせ種類: string;
  問い合わせ内容: string;
  お問い合わせ先: Array<string>;
}

export async function notify({ namedValues }: { namedValues: ContactForm }) {
  const { sendMessage } = chatwork();
  await sendMessage(
    environments.CHATWORK_ROOM_ID,
    template(namedValues),
    namedValues["お問い合わせ先"]
  );
}
