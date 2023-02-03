import telegramApi from "../api/telegramApi";

const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const telegramChatIdToNotify = import.meta.env.VITE_TELEGRAM_CHAT_ID_TO_NOTIFY;

export type FormattingOptions = "MarkdownV2" | "HTML" | "Markdown";

const sendTelegramMessage = (
  text: string,
  parse_mode: FormattingOptions = "MarkdownV2"
) =>
  telegramApi.post(`/bot${telegramBotToken}/sendMessage`, {
    chat_id: telegramChatIdToNotify,
    text,
    parse_mode,
  });

export default sendTelegramMessage;
