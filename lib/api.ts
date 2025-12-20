import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor: Antes de cada petición, pon el Token
api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    console.log(session);

    const token = session.tokens?.idToken?.toString();
    console.log(token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("No session found", error);
  }
  return config;
});

export default api;
