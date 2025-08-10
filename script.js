const backendUrl = 'https://chatbot-mdp.onrender.com'; // your backend URL

document.getElementById('askBtn').addEventListener('click', async () => {
  const question = document.getElementById('questionInput').value.trim();
  const answerText = document.getElementById('answerText');

  if (!question) {
    alert('Please enter a question.');
    return;
  }

  answerText.textContent = 'Loading...';

  try {
    const res = await fetch(`${backendUrl}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server Error: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    answerText.textContent = data.answer || 'No answer returned.';

    // Automatically read answer aloud
    if (data.answer) {
      const utterance = new SpeechSynthesisUtterance(data.answer);
      speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    answerText.textContent = 'Error getting response.';
  }
});

// 🎤 Voice recognition (unchanged)
document.getElementById('voiceBtn').addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Sorry, your browser does not support Speech Recognition.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = event => {
    const speechText = event.results[0][0].transcript;
    document.getElementById('questionInput').value = speechText;
  };

  recognition.onerror = event => {
    alert('Speech recognition error: ' + event.error);
  };
});
