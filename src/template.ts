import Handlebars from "handlebars";

const template = `タイムスタンプ: {{タイムスタンプ}}
お問い合わせ種類: {{お問い合わせ種類}}
問い合わせ内容:
{{問い合わせ内容}}
`;

export default Handlebars.compile(template);
