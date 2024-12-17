document.addEventListener("DOMContentLoaded", () => {
  // 탭 전환 기능 구현
  const jobTabButton = document.getElementById("jobTab");
  const postTabButton = document.getElementById("postTab");
  const jobContent = document.getElementById("jobContent");
  const postContent = document.getElementById("postContent");

  jobTabButton.addEventListener("click", () => {
    jobTabButton.classList.add("active");
    postTabButton.classList.remove("active");
    jobContent.classList.remove("hidden");
    postContent.classList.add("hidden");
  });

  postTabButton.addEventListener("click", () => {
    postTabButton.classList.add("active");
    jobTabButton.classList.remove("active");
    postContent.classList.remove("hidden");
    jobContent.classList.add("hidden");
  });

  // 제공된 태그 리스트
  const tags = [
    "책임감",
    "빠른 일처리",
    "팀워크",
    "성실",
    "열정",
    "창의성",
    "논리적 사고",
    "소통",
    "분석력",
    "섬세함",
    "리더십",
    "꼼꼼한 성격",
  ];

  const jobTagsContainer = document.getElementById("jobTags");
  const postTagsContainer = document.getElementById("postTags");

  // 태그를 동적으로 추가하는 함수
  function populateTags(container) {
    container.innerHTML = "";
    tags.forEach((tag) => {
      const label = document.createElement("label");
      label.className = "tag-label";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = tag;
      checkbox.name = "tags";
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(tag));
      container.appendChild(label);
    });
  }

  populateTags(jobTagsContainer);
  populateTags(postTagsContainer);

  // 폼 제출 이벤트 핸들러
  const jobSubmitButton = document.getElementById("jobSubmitButton");
  const postSubmitButton = document.getElementById("postSubmitButton");

  const BASE_URL = "https://bdf9-34-91-153-171.ngrok-free.app";

  jobSubmitButton.addEventListener("click", async () => {
    const title = document.getElementById("jobTitle").value.trim();
    const selectedTags = Array.from(
      document.querySelectorAll("#jobTags input:checked")
    ).map((input) => input.value);

    try {
      const response = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, tags: selectedTags }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Job Results:", data);
      displayResults("jobResults", data.jobs);
    } catch (error) {
      console.error("Error:", error);
      displayError("jobResults", "Failed to fetch job results.");
    }
  });

  postSubmitButton.addEventListener("click", async () => {
    const title = document.getElementById("postTitle").value.trim();
    const selectedTags = Array.from(
      document.querySelectorAll("#postTags input:checked")
    ).map((input) => input.value);

    try {
      const response = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, tags: selectedTags }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Portfolio Results:", data);
      displayResults("postResults", data.portfolio);
    } catch (error) {
      console.error("Error:", error);
      displayError("postResults", "Failed to fetch portfolio results.");
    }
  });

  // 결과 표시 함수
  function displayResults(containerId, results) {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.className = "results-container";
      if (containerId === "jobResults") {
        jobContent.appendChild(container);
      } else if (containerId === "postResults") {
        postContent.appendChild(container);
      }
    }
    container.innerHTML = "";

    if (!results || results.length === 0) {
      container.innerHTML = "<p>No results found.</p>";
      return;
    }

    results.forEach((result) => {
      const resultElement = document.createElement("div");
      resultElement.className = "result-item";
      resultElement.innerHTML = `
          <h3>${truncateText(result.title, 30)}</h3>
          <p>${truncateText(result.body, 50)}</p>
          <p><strong>Author:</strong> ${result.author || "N/A"}</p>
          <p><strong>Tags:</strong> ${result.tag?.join(", ") || "None"}</p>
          <p><strong>Period:</strong> ${result.period || "N/A"}</p>
        `;
      container.appendChild(resultElement);
    });
  }

  // 에러 메시지 표시 함수
  function displayError(containerId, errorMessage) {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.className = "results-container";
      if (containerId === "jobResults") {
        jobContent.appendChild(container);
      } else if (containerId === "postResults") {
        postContent.appendChild(container);
      }
    }
    container.innerHTML = `<p class="error">${errorMessage}</p>`;
  }

  // 텍스트를 특정 길이로 자르는 헬퍼 함수
  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  }
});
