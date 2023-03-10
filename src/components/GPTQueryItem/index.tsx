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
    <div className="gpt-query-item">
      <div className="gpt-query-item__user">
        <span className="material-symbols-outlined gpt-query-item__user__icon">
          face
        </span>
        <div className="gpt-query-item__user__question">{question}</div>
      </div>
      <div className="gpt-query-item__gpt">
        <span className="material-symbols-outlined gpt-query-item__gpt__icon">
          smart_toy
        </span>
        <button
          className="gpt-query-item__gpt__audio-button"
          onClick={() => handleAudioPlay(gptResponseId)}
        >
          {currentPlayingAudioId === gptResponseId ? (
            <span className="material-symbols-outlined gpt-query-item__gpt__audio-button__icon">
              pause
            </span>
          ) : (
            <span className="material-symbols-outlined gpt-query-item__gpt__audio-button__icon">
              play_arrow
            </span>
          )}
          <div className="gpt-query-item__gpt__audio-button__text">
            {currentPlayingAudioId === gptResponseId ? "Pause" : "Play"}
          </div>
        </button>
      </div>
    </div>
  );
}

export default GPTQueryItem;
