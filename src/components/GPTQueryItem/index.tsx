type GPTQueryItemProps = {
  question: string;
  gptResponseId: number;
  handleAudioPlay: (gptResponseId: number) => void;
  currentPlayingAudioId: number | undefined;
};

function GPTQueryItem({
  question,
  gptResponseId,
  handleAudioPlay,
  currentPlayingAudioId,
}: GPTQueryItemProps) {
  return (
    <div>
      <div>{question}</div>
      <button onClick={() => handleAudioPlay(gptResponseId)}>
        {currentPlayingAudioId === gptResponseId ? (
          <span className="material-symbols-outlined">pause</span>
        ) : (
          <span className="material-symbols-outlined">play_arrow</span>
        )}
      </button>
    </div>
  );
}

export default GPTQueryItem;
