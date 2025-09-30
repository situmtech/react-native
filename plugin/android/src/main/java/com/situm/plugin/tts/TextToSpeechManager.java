package com.situm.plugin.tts;

import android.content.Context;
import android.os.Build;
import android.speech.tts.TextToSpeech;

import java.util.Locale;

public class TextToSpeechManager implements TextToSpeech.OnInitListener {

    private final TextToSpeech textToSpeech;
    private boolean shouldSpeak = true;

    public TextToSpeechManager(Context context) {
        String enginePackage = getPreferredTtsEnginePackage(context);
        if (enginePackage != null) {
            textToSpeech = new TextToSpeech(context, this, enginePackage);
        } else {
            textToSpeech = new TextToSpeech(context, this);
        }
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            textToSpeech.setLanguage(Locale.getDefault());
        }
    }

    public void speak(String text, String language, float pitch, float rate) {
        if (!shouldSpeak) {
            return;
        }

        textToSpeech.setLanguage(new Locale(language));
        textToSpeech.setPitch(pitch);
        textToSpeech.setSpeechRate(convertToAndroidSpeechRate(rate));
        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, null);
    }

    // ui.speak_aloud_text message sends the speech rate in FlutterTts scale [0.0f,1.0f],
    // so convert it to the Android scale [0.0f,2.0f].
    private float convertToAndroidSpeechRate(float value) {
        return 2 * value;
    }

    public void onVisibilityChange(boolean mapIsVisible) {
        // TTS is paused when screen is off,
        // app goes background and MapView gets destroyed
        if (!mapIsVisible) {
            shouldSpeak = false;
            if (textToSpeech != null) {
                textToSpeech.stop();
            }
        } else {
            shouldSpeak = true;
        }
    }

    public void shutdown() {
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
    }

    private String getPreferredTtsEnginePackage(Context context) {
        TextToSpeech ttsTemp = new TextToSpeech(context, status -> {});

        String googleTts = "com.google.android.tts";
        boolean googleTtsAvailable = false;
        if (ttsTemp.getEngines() != null) {
            for (TextToSpeech.EngineInfo engine : ttsTemp.getEngines()) {
                if (engine.name.equals(googleTts)) {
                    googleTtsAvailable = true;
                    break;
                }
            }
        }
        ttsTemp.shutdown();

        if (Build.MANUFACTURER.equalsIgnoreCase("Samsung") && googleTtsAvailable) {
            return googleTts;
        } else {
            return null;
        }
    }
}
