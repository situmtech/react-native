import WebView from "react-native-webview";

export const sendMessageToViewer = (
  viewer: WebView | null,
  message: string,
) => {
  if (!viewer) return;
  viewer.injectJavaScript(`window.postMessage(${message})`);
};

/**
 * Script to prevent MapView from speaking aloud messages by it self.
 * TTS is handled by the SitumPlugin#speakAloudText.
 */
export const DISABLE_SPEECH_SYNTHESIS_SCRIPT = `
  (function(){
    const no = function(){};
    try {
      if (window.speechSynthesis) {
        ['speak','cancel','pause','resume'].forEach(function(k){
          try { window.speechSynthesis[k] = no; } catch(e){}
        });
        try { Object.defineProperty(window, 'speechSynthesis', { writable:false }); } catch(e){}
      }
      try { window.SpeechSynthesisUtterance = function(){}; } catch(e){}
    } catch (e) {}
  })();
  true;
`;
