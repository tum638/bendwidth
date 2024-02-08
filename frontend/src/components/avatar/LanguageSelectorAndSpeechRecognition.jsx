import React, { useState, useEffect, useRef } from "react";
import languages from "./languages";
import "./css/avatar.css";

const LanguageSelectorAndSpeechRecognition = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => setIsRecognizing(true);
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecognizing(false);
      };
      recognition.onend = () => setIsRecognizing(false);
      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setFinalTranscript(
              (prevText) => prevText + event.results[i][0].transcript + " "
            );
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInterimTranscript(interim);
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Speech recognition not supported");
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const toggleRecognition = () => {
    if (isRecognizing) {
      recognitionRef.current && recognitionRef.current.stop();
    } else {
      setFinalTranscript("");
      setInterimTranscript("");
      recognitionRef.current && recognitionRef.current.start();
    }
  };

  return (
    <div className="ai_avatar">
      <video autoPlay loop muted>
        <source src="/sound_waves.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="record_buttons">
        <select
          onChange={handleLanguageChange}
          value={selectedLanguage}
          className="ai_languages"
        >
          {languages.map(([name, [value]]) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
        <button onClick={toggleRecognition} className="start_recording">
          {isRecognizing ? (
            <>
              <i className="fa-solid fa-microphone-slash"></i> Stop Recognition
            </>
          ) : (
            <>
              <i className="fa-solid fa-microphone"></i> Start Recognition
            </>
          )}
        </button>
      </div>
      <div className="transcribed_text__wrapper">
        <p className="transcribed_text__heading">Transcribed text:</p>
        <p className="transcribed_text">
          {finalTranscript + interimTranscript}
        </p>
      </div>
    </div>
  );
};

export default LanguageSelectorAndSpeechRecognition;
