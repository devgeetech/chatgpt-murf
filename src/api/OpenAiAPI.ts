import { Configuration, OpenAIApi } from "openai";

type GenerateGPTResponseBody = {
  prompt: string;
};

export type ChatGPTMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GenerateChatGPTResponseBody = {
  messages: ChatGPTMessage[];
};

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
});

const openai = new OpenAIApi(configuration);

export async function generateGPTResponse({ prompt }: GenerateGPTResponseBody) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 1,
    max_tokens: 2000,
  });

  return completion;
}

export async function generateChatGPTResponse({
  messages,
}: GenerateChatGPTResponseBody) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 1,
    max_tokens: 2000,
  });

  return completion;
}
