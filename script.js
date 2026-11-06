async function askAI(prompt) {
  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}

// Test it
askAI("Explain AI in one sentence.");
