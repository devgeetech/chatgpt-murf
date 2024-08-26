import { useState, useRef } from "react";
import {
  generateChatGPTResponse,
  generateTranscription,
  ChatGPTMessage,
} from "../../api/OpenAiAPI";
import { generateSpeechWithKey, GenerateSpeechInput } from "../../api/MurfAPI";
import { useRecorder } from "../../util/recorder";
import GPTQueryItem from "../GPTQueryItem";
import Spinner from "../Spinner";

enum STATUS_TYPES {
  IDLE,
  LOADING,
}

type GPTQuery = {
  question: string;
  gptResponse: string;
  gptResponseAudioUrl: string;
};

function GPTForm() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<STATUS_TYPES>(STATUS_TYPES.IDLE);
  const [recordingStatus, setRecordingStatus] = useState<STATUS_TYPES>(
    STATUS_TYPES.IDLE
  );
  const [gptQueries, setGptQueries] = useState([] as GPTQuery[]);
  const [currentAudioId, setCurrentAudioId] = useState(
    undefined as number | undefined
  );

  const { startRecording, stopRecording, audioFile, recording } = useRecorder();

  const audioElementRef = useRef<HTMLAudioElement>(null);

  function handlePromptChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  async function handlePromptSubmit(customPrompt?: string) {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt || finalPrompt.trim() === "") {
      console.debug("Prompt is empty");
      return;
    }

    setStatus(STATUS_TYPES.LOADING);

    const messagesList = [
      {
        role: "system",
        content: "You are a helpful assistant",
      },
    ] as ChatGPTMessage[];
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
      content: finalPrompt,
    });

    const gptRes = await generateChatGPTResponse({ messages: messagesList });

    const murfPayload: GenerateSpeechInput = {
      voiceId: "en-US-marcus",
      format: "MP3",
      style: "Conversational",
      text: gptRes.choices[0].message?.content as string,
      pronunciationDictionary: {
        // "2010": { type: "SAY_AS", pronunciation: "two thousand ten" },
      },
      modelVersion: "GEN2",
    };

    const murfAudio = await generateSpeechWithKey(murfPayload);

    setGptQueries([
      ...gptQueries,
      {
        question: finalPrompt,
        gptResponse: gptRes.choices[0].message?.content as string,
        gptResponseAudioUrl: murfAudio.data.audioFile,
      },
    ]);

    setPrompt("");

    setStatus(STATUS_TYPES.IDLE);
    handleAudioPlay(gptQueries.length);
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

  async function handleAudioRecording() {
    if (!recording) {
      startRecording();
      setRecordingStatus(STATUS_TYPES.LOADING);
    } else {
      const aFile = await stopRecording();
      setRecordingStatus(STATUS_TYPES.IDLE);
      setStatus(STATUS_TYPES.LOADING);
      console.log(aFile);
      const transcript = await generateTranscription({
        audioFile: aFile as File,
        language: "en",
      });
      setPrompt(transcript.text);
      handlePromptSubmit(transcript.text);
    }
  }

  return (
    <div className="gpt-form">
      <div className="gpt-form__heading">Murf Assistant</div>
      <div className="gpt-form__queries">
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
          <div className="gpt-form__queries__placeholder">
            Start by asking a question
          </div>
        )}
      </div>
      <div className="gpt-form__user-input">
        <input
          onChange={handlePromptChange}
          value={prompt}
          disabled={status === STATUS_TYPES.LOADING}
          className="gpt-form__user-input__actual"
        />
        <button
          onClick={handleAudioRecording}
          disabled={status === STATUS_TYPES.LOADING}
          className="gpt-form__user-input__button"
        >
          <span className="material-symbols-outlined gpt-form__user-input__button__icon">
            {recordingStatus === STATUS_TYPES.LOADING
              ? "radio_button_checked"
              : "mic"}
          </span>
        </button>
        <button
          onClick={() => handlePromptSubmit()}
          disabled={status === STATUS_TYPES.LOADING}
          className="gpt-form__user-input__button"
        >
          {status === STATUS_TYPES.LOADING ? (
            <Spinner />
          ) : (
            <span className="material-symbols-outlined gpt-form__user-input__button__icon">
              send
            </span>
          )}
        </button>
      </div>
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
