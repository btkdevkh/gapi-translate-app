const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voice");
const playButton = document.getElementById("play");

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

// Play button
playButton.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(textInput.value);
  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) utterance.voice = selectedVoice;
  speechSynthesis.speak(utterance);
});
