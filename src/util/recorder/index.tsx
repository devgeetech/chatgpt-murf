import { useRef, useState } from "react";
import RecordRTC from "recordrtc";

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const mediaRecorder = useRef<RecordRTC | null>(null);

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = {
      recorderType: RecordRTC.StereoAudioRecorder,
      type: "audio",
      mimeType: "audio/wav",
    };
    mediaRecorder.current = new RecordRTC(stream, options);
    mediaRecorder.current.startRecording();
    setTimeout(() => {
      if (recording) {
        stopRecording();
      }
    }, 5000);
  };

  async function stopRecording() {
    return new Promise<File>((resolve) => {
      if (mediaRecorder.current) {
        setRecording(false);
        mediaRecorder.current.stopRecording(() => {
          const audioBlob = mediaRecorder.current.getBlob();
          const file = new File([audioBlob], "filename.wav", {
            type: "audio/wav",
          });
          setAudioBlob(audioBlob);
          setAudioFile(file);
          setRecording(false);

          resolve(file);
        });
      }
    });
  }

  return {
    recording,
    audioBlob,
    audioFile,
    startRecording,
    stopRecording,
  };
}
