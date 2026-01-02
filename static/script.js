let recognition;
let englishText = "";

function startListening() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = ""; // auto detect
  recognition.interimResults = false;
  recognition.continuous = false;

  document.getElementById("statusText").innerText = "🎙️ Listening...";
  document.getElementById("statusText").style.color = "#2563eb";

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript;

    // STEP 1: Convert spoken text → ENGLISH
    fetch("/speech-to-english", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: spokenText })
    })
    .then(res => res.json())
    .then(data => {
      englishText = data.english_text;
      document.getElementById("englishOutput").value = englishText;

      document.getElementById("statusText").innerText = "✅ Converted to English";
      document.getElementById("statusText").style.color = "#16a34a";
    });
  };

  recognition.onerror = function () {
    document.getElementById("statusText").innerText = "❌ Error";
    document.getElementById("statusText").style.color = "#dc2626";
  };

  recognition.start();
}

function translateEnglish() {
  const targetLang = document.getElementById("languageSelect").value;

  if (!englishText) {
    alert("No English text available");
    return;
  }

  // STEP 2: English → Selected Language
  fetch("/english-to-language", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: englishText,
      dest: targetLang
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("finalOutput").value = data.translated_text;
  });
}
