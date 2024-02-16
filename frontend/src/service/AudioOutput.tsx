export const speaktext = (text: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2; // Adjust the rate as needed
  
      const chooseVoice = () => {
        let voices = window.speechSynthesis.getVoices();
  
        // Filter for female voices
        let femaleVoices = voices.filter((voice) => voice.name.toLowerCase().includes("female"));
        let maleVoices = voices.filter((voice) => voice.name.toLowerCase().includes("male"));
  
        if (femaleVoices.length > 0) {
          // Choose the first available female voice
          utterance.voice = femaleVoices[0];
          window.speechSynthesis.speak(utterance);
          console.log("Voice is qorking , sound not coming out")
        } else {
          utterance.voice = maleVoices[0];
          window.speechSynthesis.speak(utterance);
          console.warn("No female voice available. Speech synthesis not performed.");
        }
      };
  
      if (window.speechSynthesis.getVoices().length > 0) {
        chooseVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = chooseVoice;
      }
    } else {
      console.error("Your browser does not support text-to-speech.");
    }
  };
  