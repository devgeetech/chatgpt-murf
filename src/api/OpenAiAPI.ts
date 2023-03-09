import { Configuration, OpenAIApi, CreateCompletionResponse } from "openai";
import { AxiosResponse } from "axios";

type GenerateGPTBody = {
  prompt: string;
};

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
});

const openai = new OpenAIApi(configuration);

export async function generateGPTResponse({ prompt }: GenerateGPTBody) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 1,
    max_tokens: 2000,
  });

  return completion;
}
