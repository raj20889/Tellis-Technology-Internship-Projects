const API_URL = "http://138.201.198.73:11434/api/chat";
const MODEL = "llama3.1:8b-instruct-q4_K_M";

const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userInput = input.value.trim();
  if (!userInput) return;

  addMessage(userInput, 'user');
  input.value = '';

  const reply = await getAIResponse(userInput);
  addMessage(reply, 'ai');
});

function addMessage(text, role) {
  const msg = document.createElement('div');
  msg.classList.add('message', role);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getAIResponse(prompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "user", content: prompt }
      ],
      stream: false
    })
  });

  if (!res.ok) return "Error: " + res.statusText;

  const data = await res.json();
  return data.message?.content || "No response.";
}
