import {SpeechTranslationConfig, AudioConfig, TranslationRecognizer, ResultReason, CancellationReason} from 'microsoft-cognitiveservices-speech-sdk';
import callStatus from '../redux-elements/callStatus';
const SPEECH_KEY = "fe3a4cd21d99428db7dd42cbe5f4698c"
const SPEEECH_REGION = "eastus"

const translate = (stream, sourceLanguage, targetLanguage, stopTranslation, socket, uuid, isRespondent) => {
    console.log("in translate function")
    console.log("source language", sourceLanguage, "target language", targetLanguage);
    console.log(uuid)
    let audioStream = new MediaStream(stream.getAudioTracks());

    const speechTranslationConfig = SpeechTranslationConfig.fromSubscription(SPEECH_KEY, SPEEECH_REGION);
    speechTranslationConfig.speechRecognitionLanguage = sourceLanguage;
    console.log("target Language", targetLanguage)

    try {
        speechTranslationConfig.addTargetLanguage(targetLanguage);
    } catch (error) {
        speechTranslationConfig.addTargetLanguage("en");
        console.log("target Language error", error)
    }
    

    const audioConfig = AudioConfig.fromStreamInput(audioStream);

    const translationRecognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig);

    translationRecognizer.startContinuousRecognitionAsync();

    // Function to check if translation should stop
    const checkTranslationStatus = () => {
        if (stopTranslation()) {
            translationRecognizer.stopContinuousRecognitionAsync();
        }
    }
    translationRecognizer.recognizing = (s, e) => {

        checkTranslationStatus();
        let chunk;
        try {
            chunk = e.result.translations.get(targetLanguage);
        } catch (error) {
            chunk = e.result.translations.get("en");
        }
        socket.emit("translatedChunk", {uuid, chunk, isRespondent})
        if (e.result.reason == ResultReason.RecognizedSpeech) {
            // console.log(`TRANSLATED: Text=${e.result.translations.get(targetLanguage)}`);
            
        }
        else if (e.result.reason == ResultReason.NoMatch) {
            console.log("NOMATCH: Speech could not be translated.");
     }
    }

    translationRecognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason == CancellationReason.Error) {
            console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
            console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
            console.log("CANCELED: Did you set the speech resource key and region values?");
        }
        translationRecognizer.stopContinuousRecognitionAsync();
    };

    translationRecognizer.sessionStopped = (s, e) => {
        console.log("\n    Session stopped event.");
        translationRecognizer.stopContinuousRecognitionAsync();
    };
    

    
}

export default translate;