import telegramApi from "../api/telegramApi";

const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const telegramChatIdToNotify = import.meta.env.VITE_TELEGRAM_CHAT_ID_TO_NOTIFY;

const sendTelegramImg = (blob: Blob) => {
  const formData = new FormData();

  formData.append("photo", blob, "photo");
  formData.append("chat_id", telegramChatIdToNotify);
  formData.append("disable_web_page_preview", "true");

  return telegramApi.post(`/bot${telegramBotToken}/sendPhoto`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default sendTelegramImg;
