import axios from 'axios';

const baseURL = import.meta.env.VITE_TELEGRAM_API_URL;

const telegramApi = axios.create({
  baseURL,
});

export default telegramApi;
