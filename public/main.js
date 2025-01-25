const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voice");
const playButton = document.getElementById("play");
const languageSelect = document.getElementById("language");

// Array of supported languages with their ISO language codes
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
];

// Load available languages
languages.forEach((lang) => {
  const option = document.createElement("option");
  option.value = lang.code;
  option.textContent = lang.name;
  languageSelect.appendChild(option);
});

// Load available voices
let voices = [];
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voices.forEach((voice, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Trigger loadVoices when voiceschanged event is fired
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// TTS: Text-to-speech
function playText(text, voiceIdx) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (voices[voiceIdx]) utterance.voice = voices[voiceIdx];
  speechSynthesis.speak(utterance);
}

// Https: Translate text with serverless function
async function translateText(text, targetLanguage) {
  try {
    const response = await fetch(`/api/translate`, {
      method: "POST",
      body: JSON.stringify({ text, target: targetLanguage }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.data.traslations[0].translatedText;
  } catch (error) {
    console.error("Error translating text", error);
    return text;
  }
}

// Play button
playButton.addEventListener("click", async () => {
  const text = textInput.value;
  const targetLanguage = languageSelect.value;
  const selectedVoiceIndex = voiceSelect.value;

  if (text === "") {
    alert("Please enter some text to play");
    return;
  }

  try {
    const translatedText = await translateText(text, targetLanguage);
    playText(translatedText, selectedVoiceIndex);
  } catch (error) {
    console.error("Error playing text", error);
  }
});
