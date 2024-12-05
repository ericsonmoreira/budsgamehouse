import telegramApi from "../api/telegramApi";

const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const telegramChatIdToNotify = import.meta.env.VITE_TELEGRAM_CHAT_ID_TO_NOTIFY;

const sendTelegramMessage = (text: string) =>
  telegramApi.post(`/bot${telegramBotToken}/sendMessage`, {
    chat_id: telegramChatIdToNotify,
    text,
  });

export default sendTelegramMessage;
