import { useState, useRef } from "react";
import { generateChatGPTResponse, ChatGPTMessage } from "../../api/OpenAiAPI";
import { generateSpeechWithKey, GenerateSpeechInput } from "../../api/MurfAPI";
import GPTQueryItem from "../GPTQueryItem";

type GPTQuery = {
  question: string;
  gptResponse: string;
  gptResponseAudioUrl: string;
};

function GPTForm() {
  const [prompt, setPrompt] = useState("");
  const [gptQueries, setGptQueries] = useState([] as GPTQuery[]);
  const [currentAudioId, setCurrentAudioId] = useState(
    undefined as number | undefined
  );

  const audioElementRef = useRef<HTMLAudioElement>(null);

  function handlePromptChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  async function handlePromptSubmit() {
    if (!prompt) return;

    const messagesList = [] as ChatGPTMessage[];
    gptQueries.forEach((query) => {
      messagesList.push(
        {
          role: "user",
          content: query.question,
        },
        {
          role: "assistant",
          content: query.gptResponse,
        }
      );
    });
    messagesList.push({
      role: "user",
      content: prompt,
    });

    const gptRes = await generateChatGPTResponse({ messages: messagesList });

    const murfPayload: GenerateSpeechInput = {
      voiceId: "en-US-marcus",
      format: "MP3",
      text: gptRes.data.choices[0].message?.content as string,
    };

    const murfAudio = await generateSpeechWithKey(murfPayload);

    setGptQueries([
      ...gptQueries,
      {
        question: prompt,
        gptResponse: gptRes.data.choices[0].message?.content as string,
        gptResponseAudioUrl: murfAudio.data.audioFile,
      },
    ]);
  }

  function handleAudioPlay(audioIdToPlay: number) {
    if (currentAudioId === audioIdToPlay) {
      audioElementRef.current?.pause();
      setCurrentAudioId(undefined);
    } else {
      setCurrentAudioId(audioIdToPlay);
      audioElementRef.current?.play();
    }
  }

  function handleOnAudioPlayEnd() {
    setCurrentAudioId(undefined);
  }

  return (
    <div className="gpt-form">
      <div className="gpt-form__heading">ChatGPT + Murf</div>
      {gptQueries.length > 0 ? (
        gptQueries?.map((gptQuery, index) => {
          return (
            <GPTQueryItem
              key={`${gptQuery.question} + ${index}`}
              question={gptQuery.question}
              gptResponseId={index}
              handleAudioPlay={handleAudioPlay}
              currentPlayingAudioId={currentAudioId ?? undefined}
            />
          );
        })
      ) : (
        <div>Start by asking a question</div>
      )}
      <input onChange={handlePromptChange} value={prompt} />
      <button onClick={handlePromptSubmit}>Submit</button>
      <audio
        autoPlay
        ref={audioElementRef}
        onEnded={handleOnAudioPlayEnd}
        src={
          currentAudioId !== undefined
            ? gptQueries[currentAudioId].gptResponseAudioUrl
            : undefined
        }
      />
    </div>
  );
}

export default GPTForm;
