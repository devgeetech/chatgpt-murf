import OpenAI from "openai";

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

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_MURF_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
});

// export async function generateGPTResponse({ prompt }: GenerateGPTResponseBody) {
//   const completion = await openai.chat.completions.create({
//     model: "text-davinci-003",
//     prompt: prompt,
//     temperature: 1,
//     max_tokens: 1000,
//   });

//   return completion;
// }

export async function generateChatGPTResponse({
  messages,
}: GenerateChatGPTResponseBody) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    temperature: 1,
    max_tokens: 1000,
  });

  return completion;
}

export async function generateTranscription({
  audioFile,
  language,
}: {
  audioFile: File;
  language: string;
}) {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    language: language,
    model: "whisper-1",
  });
  return transcription;
}
