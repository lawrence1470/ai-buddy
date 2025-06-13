import { TTSService } from "@/services/ttsService";
import { useEffect, useState } from "react";

export function useAISpeaking(): boolean {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = TTSService.addSpeakingStateListener((speaking) => {
      setIsSpeaking(speaking);
    });

    return unsubscribe;
  }, []);

  return isSpeaking;
}
