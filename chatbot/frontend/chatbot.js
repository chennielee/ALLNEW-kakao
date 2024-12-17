document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  const addMessage = (message, sender) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const getBotResponse = (userMessage) => {
    // Simple logic for bot response
    if (userMessage.includes("hello")) {
      return "Hi there! How can I assist you today?";
    } else if (userMessage.includes("help")) {
      return "Sure! Let me know what you need help with.";
    } else {
      return "I'm just a simple bot. Can you elaborate?";
    }
  };

  sendBtn.addEventListener("click", () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, "user");
      const botResponse = getBotResponse(userMessage);
      setTimeout(() => addMessage(botResponse, "bot"), 500);
      userInput.value = "";
    }
  });

  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendBtn.click();
    }
  });
});
