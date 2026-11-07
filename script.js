// 1. Get Elements
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatHistory = document.getElementById("chatHistory");
const greeting = document.querySelector(".greeting");

// Drawer Elements
const openDrawerBtn = document.getElementById("openDrawer");
const closeDrawerBtn = document.getElementById("closeDrawer");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");

// ============================================================
// 2. DRAWER LOGIC
// ============================================================
openDrawerBtn.addEventListener("click", () => {
  drawer.classList.add("open");
  overlay.classList.add("active");
});

function closeDrawer() {
  drawer.classList.remove("open");
  overlay.classList.remove("active");
}

closeDrawerBtn.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// ============================================================
// 3. AUTO-RESIZE TEXTAREA
// ============================================================
userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
});

// ============================================================
// 4. AI CHAT LOGIC (Pollinations API - No Key Needed)
// ============================================================
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Hide the big greeting
  greeting.style.display = "none";

  // 1. Show User Message
  chatHistory.innerHTML += `<div class="chat-msg user">${text}</div>`;

  // Clear input
  userInput.value = "";
  userInput.style.height = "auto";

  // 2. Show Loading state
  const loadingId = "loading-" + Date.now();
  chatHistory.innerHTML += `<div class="chat-msg ai" id="${loadingId}">Thinking...</div>`;
  chatHistory.scrollTop = chatHistory.scrollHeight;

  try {
    // 3. Fetch AI Response (Free API)
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [{ role: "user", content: text }],
      }),
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    // 4. Replace "Thinking..." with the actual reply
    const loadingElement = document.getElementById(loadingId);
    loadingElement.innerHTML = aiReply;
  } catch (error) {
    const loadingElement = document.getElementById(loadingId);
    loadingElement.innerHTML = "⚠️ Connection error. Please try again.";
    loadingElement.style.color = "#ffb4ab";
  }

  // Scroll to bottom
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Trigger on button click
sendBtn.addEventListener("click", sendMessage);

// Trigger on Enter key (Shift+Enter for new line)
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Stop new line
    sendMessage();
  }
});
