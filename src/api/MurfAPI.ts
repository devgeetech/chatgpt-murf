import axios from "axios";

export type GenerateSpeechInput = {
  voiceId: string;
  text: string;
  format: string;
};

export const api = axios.create({
  baseURL: "https://api.dev.murf.ai",
});

export async function generateSpeechWithKey(data: GenerateSpeechInput) {
  return api.post("/v1/speech/generate-with-key", data, {
    headers: {
      "api-key": import.meta.env.VITE_MURF_API_KEY_DEV,
      "Content-Type": "application/json",
    },
  });
}
