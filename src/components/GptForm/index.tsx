import { useState } from "react";
import { CreateCompletionResponse } from "openai";
import { generateGPTResponse } from "../../api/OpenAiAPI";
import { generateSpeechWithKey, GenerateSpeechInput } from "../../api/MurfAPI";

function GPTForm() {
  const [prompt, setPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  function handlePromptChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  async function handlePromptSubmit() {
    if (!prompt) return;

    const gptRes = await generateGPTResponse({ prompt });

    const murfPayload: GenerateSpeechInput = {
      voiceId: "en-US-marcus",
      format: "MP3",
      text: gptRes.data.choices[0].text as string,
    };

    const murfAudio = await generateSpeechWithKey(murfPayload);

    setAudioUrl(murfAudio.data.audioFile);
  }

  return (
    <div className="gpt-form">
      <div className="gpt-form__heading">Ask a question</div>
      <input onChange={handlePromptChange} value={prompt} />
      <button onClick={handlePromptSubmit}>Submit</button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}

export default GPTForm;
