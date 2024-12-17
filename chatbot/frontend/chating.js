const apiUrl = "https://5712-34-16-217-141.ngrok-free.app"; // Colab에서 출력된 ngrok URL
let selectedFiles = []; // 선택된 파일을 저장하는 배열

// 메시지 추가 함수
const addMessage = (message, sender) => {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${sender}-message`);

  // 메시지가 객체일 경우 JSON 문자열로 변환
  if (typeof message === "object") {
    message = JSON.stringify(message, null, 2); // JSON을 보기 좋게 문자열화
  }

  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

// 초기 메시지 표시
document.addEventListener("DOMContentLoaded", () => {
  const initialMessage = "안녕하세요. 어떻게 도와드릴까요?";
  addMessage(initialMessage, "bot");
});

// 사용자 질문 이벤트
document.getElementById("send-btn").addEventListener("click", async () => {
  const userInput = document.getElementById("user-input");
  const userMessage = userInput.value.trim();

  if (!userMessage) {
    addMessage("Please enter a message.", "bot");
    return;
  }

  // 사용자 메시지 추가
  addMessage(userMessage, "user");

  userInput.value = "";

  // 서버로 질문 전송
  try {
    // JSON 데이터 생성
    const requestBody = {
      query: userMessage,
      top_k: 5, // 기본값으로 5를 설정
    };

    // 디버깅: 서버로 전송되는 JSON 출력
    console.log("JSON Body Sent:", JSON.stringify(requestBody));

    const response = await fetch(`${apiUrl}/ask/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON 데이터 전송
      },
      body: JSON.stringify(requestBody), // JSON 본문 문자열화
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Response Received:", result);

      // 서버에서 받은 응답 메시지를 추가
      addMessage(result.answer.content || "No response from server.", "bot");
    } else {
      const errorText = await response.text();
      addMessage("에러가 발생했어요. 잠시 후 시도해주세요.", "bot");
      console.error("Error Response:", errorText);
    }
  } catch (error) {
    addMessage("에러가 발생했어요. 잠시 후 시도해주세요.", "bot");
    console.error("Fetch Error:", error);
  }
});

// Enter 키 입력 이벤트
document.getElementById("user-input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.getElementById("send-btn").click();
  }
});

/////아래부터는upload 관련
// 파일 선택 이벤트
document.getElementById("pdfFiles").addEventListener("change", (event) => {
  const files = Array.from(event.target.files); // 새로 선택한 파일 배열
  const fileNames = selectedFiles.map((file) => file.name); // 기존 파일 이름 배열

  // 중복되지 않는 파일만 추가
  files.forEach((file) => {
    if (!fileNames.includes(file.name)) {
      selectedFiles.push(file);
    }
  });

  const fileCountSpan = document.getElementById("file-count");
  const uploadButton = document.getElementById("upload-btn");

  // 선택된 파일 개수를 표시
  fileCountSpan.textContent = `(${selectedFiles.length})`;

  // 파일이 선택되었을 때만 Upload 버튼 활성화
  uploadButton.disabled = selectedFiles.length === 0;
});

// Upload 버튼 클릭 이벤트
document
  .getElementById("upload-btn")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select PDFs to upload.");
      return;
    }

    addMessage("자료를 읽고 있어요. 잠시만 기다려주세요.", "bot");

    for (const file of selectedFiles) {
      try {
        // 파일을 base64로 변환
        const base64Data = await convertFileToBase64(file);

        console.log(`Uploading ${file.name}...`);

        const response = await fetch(`${apiUrl}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: file.name,
            base64_data: base64Data,
          }),
        });

        const responseText = await response.text();
        console.log("Response:", responseText);

        if (!response.ok) {
          addMessage(`${file.name} 업로드 실패: ${responseText}`, "bot");
          continue;
        }

        try {
          const result = JSON.parse(responseText);
          if (result.message === "200") {
            console.log(`Successfully uploaded: ${file.name}`);
            addMessage(
              `${file.name} 업로드 완료! 궁금한 것을 질문해주세요.`,
              "bot"
            );
            // 초기화 코드 추가
            selectedFiles = [];
            document.getElementById("file-count").textContent = "(0)";
            document.getElementById("upload-btn").disabled = true;
            document.getElementById("pdfFiles").value = ""; // 파일 입력 초기화
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
          addMessage(`${file.name} 처리 중 오류 발생`, "bot");
        }
      } catch (error) {
        console.error(`Upload error:`, error);
        addMessage(`${file.name} 업로드 중 오류 발생`, "bot");
      }
    }
  });

// 파일을 base64로 변환하는 함수
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
