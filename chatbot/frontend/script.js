document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const fileUpload = document.getElementById("file-upload");

  let uploadedFile = null;

  fileUpload.addEventListener("change", (event) => {
    uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileName = document.createElement("div");
      fileName.classList.add("message", "bot-message");
      fileName.textContent = `Uploaded file: ${uploadedFile.name}`;
      messagesDiv.appendChild(fileName);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  });

  const addMessage = (message, sender) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  const getBotResponse = (userMessage) => {
    if (userMessage.toLowerCase().includes("hello")) {
      return "Hi there! How can I assist you?";
    } else if (userMessage.toLowerCase().includes("file")) {
      return uploadedFile
        ? `You've uploaded: ${uploadedFile.name}`
        : "You haven't uploaded a file yet.";
    } else {
      return "I'm just a simple bot. Can you explain more?";
    }
  };

  sendBtn.addEventListener("click", () => {
    const userMessage = chatInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, "user");
      const botResponse = getBotResponse(userMessage);
      setTimeout(() => addMessage(botResponse, "bot"), 500);
      chatInput.value = "";
    }
  });

  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendBtn.click();
    }
  });
});
