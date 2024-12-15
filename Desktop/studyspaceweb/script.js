const addVideoButton = document.getElementById("addVideoButton");
const videoModal = document.getElementById("videoModal");
const insertVideoButton = document.getElementById("insertVideoButton");
const youtubeLinkInput = document.getElementById("youtubeLink");
const videoWidthInput = document.getElementById("videoWidth");
const videoHeightInput = document.getElementById("videoHeight");

// Open modal
addVideoButton.addEventListener("click", () => {
  videoModal.style.display = "flex";
});

// Insert video and close modal
insertVideoButton.addEventListener("click", () => {
  const youtubeLink = youtubeLinkInput.value;
  const width = videoWidthInput.value || 560;
  const height = videoHeightInput.value || 315;

  if (youtubeLink) {
    const videoId = extractVideoId(youtubeLink);
    if (!videoId) {
      alert("Invalid YouTube URL. Please provide a valid link.");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.width = width;
    iframe.height = height;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.style.border = "none";

    iframe.onerror = () => {
      alert("This video cannot be embedded due to restrictions.");
    };

    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container";
    videoContainer.appendChild(iframe);
    document.body.appendChild(videoContainer);

    makeDraggable(videoContainer);

    // Add right-click delete functionality
    videoContainer.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const confirmDelete = confirm("Do you want to delete this video?");
      if (confirmDelete) {
        videoContainer.remove();
      }
    });

    videoModal.style.display = "none";
    youtubeLinkInput.value = "";
    videoWidthInput.value = "";
    videoHeightInput.value = "";
  } else {
    alert("Please enter a YouTube link.");
  }
});

// Close modal on outside click
videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) {
    videoModal.style.display = "none";
  }
});

// Draggable functionality
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - element.getBoundingClientRect().left;
    offsetY = event.clientY - element.getBoundingClientRect().top;
    element.style.zIndex = "1000";
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      element.style.left = `${event.clientX - offsetX}px`;
      element.style.top = `${event.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    element.style.zIndex = "500";
  });
}
// Extract Video ID from YouTube URL
function extractVideoId(url) {
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      return urlObj.searchParams.get("v");
    } else if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }
    return null;
  } catch {
    return null;
  }
}

//Sticker modal
const addStickerButton = document.getElementById("addStickerButton");
const stickerModal = document.getElementById("stickerModal");
const stickerUpload = document.getElementById("stickerUpload");

// Open modal
addStickerButton.addEventListener("click", () => {
  stickerModal.style.display = "flex";
});

// Close modal on outside click
stickerModal.addEventListener("click", (event) => {
  if (event.target === stickerModal) {
    stickerModal.style.display = "none";
  }
});

// Add preset stickers
document.querySelectorAll(".preset-sticker").forEach((sticker) => {
  sticker.addEventListener("click", () => {
    addStickerToPage(sticker.src);
    stickerModal.style.display = "none";
  });
});

// Upload custom sticker
stickerUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      addStickerToPage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  stickerModal.style.display = "none";
});

// Function to add sticker to the page
function addStickerToPage(src) {
  const sticker = document.createElement("div");
  sticker.className = "sticker";
  const img = document.createElement("img");
  img.src = src;
  sticker.appendChild(img);
  document.body.appendChild(sticker);

  makeDraggable(sticker);

  // Add right-click delete functionality
  sticker.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const confirmDelete = confirm("Do you want to delete this sticker?");
    if (confirmDelete) {
      sticker.remove();
    }
  });
}
// Draggable functionality
function makeDraggable(element) {
  let isDragging = false;
  let isResizing = false;
  let offsetX, offsetY, startWidth, startHeight, startX, startY;

  element.addEventListener("mousedown", (event) => {
    const rect = element.getBoundingClientRect();
    const isOnEdge =
      event.clientX > rect.right - 10 && event.clientY > rect.bottom - 10;

    if (isOnEdge) {
      isResizing = true;
      startWidth = rect.width;
      startHeight = rect.height;
      startX = event.clientX;
      startY = event.clientY;
    } else {
      isDragging = true;
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
    }

    element.style.zIndex = "1000";
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      element.style.left = `${event.clientX - offsetX}px`;
      element.style.top = `${event.clientY - offsetY}px`;
    }

    if (isResizing) {
      const width = startWidth + (event.clientX - startX);
      const height = startHeight + (event.clientY - startY);
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    isResizing = false;
    element.style.zIndex = "500";
  });
}

//todo list
// Open the modal when the To-Do List button is clicked
// Open the modal when the To-Do List button is clicked
document.getElementById("todo-button").addEventListener("click", function () {
  document.getElementById("todo-modal").style.display = "flex";
});

// Close the modal when the Add List button is clicked
document.getElementById("add-todo-list").addEventListener("click", function () {
  // Get user input
  const title = document.getElementById("todo-title").value;
  const tasks = document.getElementById("todo-tasks").value.split("\n");
  const color = document.getElementById("todo-color").value;

  // Create a new to-do list element
  const todoList = document.createElement("div");
  todoList.classList.add("todo-list");
  todoList.style.backgroundColor = color;

  // Add title to the list
  const todoTitle = document.createElement("div");
  todoTitle.classList.add("title");
  todoTitle.textContent = title;
  todoList.appendChild(todoTitle);

  // Add tasks to the list with checkboxes
  const taskList = document.createElement("ul");
  tasks.forEach((task) => {
    const listItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        listItem.style.textDecoration = "line-through";
      } else {
        listItem.style.textDecoration = "none";
      }
    });

    const taskText = document.createElement("span");
    taskText.textContent = task;
    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);

    taskList.appendChild(listItem);
  });
  todoList.appendChild(taskList);

  // Add the to-do list to the container
  document.getElementById("todo-lists-container").appendChild(todoList);

  // Enable dragging functionality
  todoList.onmousedown = function (e) {
    let offsetX = e.clientX - todoList.getBoundingClientRect().left;
    let offsetY = e.clientY - todoList.getBoundingClientRect().top;

    document.onmousemove = function (e) {
      todoList.style.left = e.clientX - offsetX + "px";
      todoList.style.top = e.clientY - offsetY + "px";
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // Custom resizing functionality
  let isResizing = false;
  let startWidth, startHeight, startX, startY;

  // Add a resize handle at the bottom-right corner
  const resizeHandle = document.createElement("div");
  resizeHandle.classList.add("resize-handle");
  todoList.appendChild(resizeHandle);

  resizeHandle.onmousedown = function (e) {
    e.preventDefault();
    isResizing = true;
    startWidth = todoList.offsetWidth;
    startHeight = todoList.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;

    document.onmousemove = function (e) {
      if (isResizing) {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        todoList.style.width = newWidth + "px";
        todoList.style.height = newHeight + "px";
      }
    };

    document.onmouseup = function () {
      isResizing = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // Right-click to delete the list
  todoList.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    const deleteOption = confirm("Do you want to delete this to-do list?");
    if (deleteOption) {
      todoList.remove();
    }
  });

  // Close the modal
  document.getElementById("todo-modal").style.display = "none";

  // Clear the modal inputs
  document.getElementById("todo-title").value = "";
  document.getElementById("todo-tasks").value = "";
  document.getElementById("todo-color").value = "#f1f1f1";
});

// To close the modal if clicked outside
document.getElementById("todo-modal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("todo-modal")) {
    document.getElementById("todo-modal").style.display = "none";
  }
});

//pomodoro timer
// Pomodoro timer
let pomodoroTimer;
let timerRunning = false;
let remainingTime = 25 * 60; // Default to 25 minutes in seconds
let audio = new Audio();

// Open Pomodoro Modal
document.getElementById("pomodoro-button").addEventListener("click", () => {
  document.getElementById("pomodoro-modal").style.display = "flex";
  document.getElementById("pomodoro-time").value = formatTime(remainingTime);
});

// Close Pomodoro Modal on outside click
document.getElementById("pomodoro-modal").addEventListener("click", (event) => {
  if (event.target === document.getElementById("pomodoro-modal")) {
    document.getElementById("pomodoro-modal").style.display = "none";
  }
});

// Timer controls
document.getElementById("start-timer").addEventListener("click", () => {
  if (!timerRunning) {
    startTimer();
    document.getElementById("start-timer").disabled = true;
    document.getElementById("pause-timer").disabled = false;
    document.getElementById("stop-timer").disabled = false;
  }
});

document.getElementById("pause-timer").addEventListener("click", () => {
  if (timerRunning) {
    pauseTimer();
  } else {
    resumeTimer();
  }
});

document.getElementById("stop-timer").addEventListener("click", () => {
  stopTimer();
  document.getElementById("start-timer").disabled = false;
  document.getElementById("pause-timer").disabled = true;
  document.getElementById("stop-timer").disabled = true;
});

// Change time manually by clicking on the input
document.getElementById("pomodoro-time").addEventListener("click", () => {
  const timeInput = document.getElementById("pomodoro-time");
  timeInput.setSelectionRange(0, timeInput.value.length);
});

// Handle user input change
document.getElementById("pomodoro-time").addEventListener("input", (event) => {
  const time = event.target.value.split(":");
  if (time.length === 2) {
    const minutes = parseInt(time[0], 10);
    const seconds = parseInt(time[1], 10);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      remainingTime = minutes * 60 + seconds;
    }
  }
});

// Handle file upload sound
document
  .getElementById("pomodoro-upload")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create an object URL for the uploaded file and set it as the audio source
      audio.src = URL.createObjectURL(file);
    }
  });

// Format time into mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// Timer Logic
function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    pomodoroTimer = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        document.getElementById("pomodoro-time").value =
          formatTime(remainingTime);
      } else {
        clearInterval(pomodoroTimer);
        // Play the uploaded sound when the timer ends
        if (audio.src) {
          audio
            .play()
            .catch((error) => console.error("Error playing audio:", error)); // Play sound if available
        }
        stopTimer();
      }
    }, 1000);
  }
}

// Function to pause the timer
function pauseTimer() {
  timerRunning = false;
  clearInterval(pomodoroTimer);
}

// Function to resume the timer
function resumeTimer() {
  if (!timerRunning) {
    startTimer();
    document.getElementById("pause-timer").textContent = "Pause"; // Change button text if needed
  }
}

// Function to stop the timer
function stopTimer() {
  timerRunning = false;
  clearInterval(pomodoroTimer);
  remainingTime = 25 * 60; // Reset to 25 minutes
  document.getElementById("pomodoro-time").value = formatTime(remainingTime);
  document.getElementById("start-timer").disabled = false;
  document.getElementById("pause-timer").disabled = true;
  document.getElementById("stop-timer").disabled = true;
}

//about me modal
const aboutModal = document.getElementById("about-modal");

// Get the button that opens the modal
const aboutButton = document.getElementById("about-button");

// Get the <span> element that closes the modal
const closeAboutButton = document.getElementById("close-about");

// When the user clicks the button, open the modal
aboutButton.addEventListener("click", () => {
  aboutModal.style.display = "flex"; // Open the modal
});

// When the user clicks on <span> (x), close the modal
closeAboutButton.addEventListener("click", () => {
  aboutModal.style.display = "none"; // Close the modal
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target === aboutModal) {
    aboutModal.style.display = "none"; // Close the modal
  }
});

//feedback

// Get the modal, button, and close elements
// Initialize EmailJS with your public API key
// Initialize EmailJS
emailjs.init("1fLu5tu41e6ZEJgit");

// Get the modal and the button
const modal = document.getElementById("feedback-modal");
const btn = document.getElementById("feedback-btn");
const closeBtn = document.getElementsByClassName("close")[0];

// Get the form and feedback elements
const form = document.getElementById("feedback-form");
const emailInput = document.getElementById("user-email");
const feedbackInput = document.getElementById("user-feedback");

// Open the modal when the button is clicked
btn.addEventListener("click", function () {
  modal.style.display = "flex"; // Show the modal
});

// Close the modal when the user clicks the close button (x)
closeBtn.addEventListener("click", function () {
  modal.style.display = "none"; // Hide the modal
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none"; // Hide the modal
  }
});

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Capture email and feedback values
  const userEmail = emailInput.value || "No email provided"; // Default to 'No email provided' if not given
  const userFeedback = feedbackInput.value;

  // Log the captured values to check if they are correct
  console.log("Email:", userEmail);
  console.log("Feedback:", userFeedback);

  // Send the feedback data to EmailJS
  emailjs
    .send("service_ch85cnn", "template_c7fbwjs", {
      user_name: userEmail,
      feedback_message: userFeedback,
    })
    .then(
      function (response) {
        alert("Feedback sent successfully!");
        form.reset(); // Reset the form after submission
        modal.style.display = "none"; // Close the modal after submission
      },
      function (error) {
        alert("Failed to send feedback. Please try again.");
        console.error("EmailJS Error:", error);
      }
    );
});

//journal entry
// Get elements
const journalButton = document.getElementById("journal-entry-btn");
const journalModal = document.getElementById("journal-entry-box");
const closeJournalModalButton = document.getElementById("close-journal-btn");
const saveJournalButton = document.getElementById("submit-journal-btn");
const journalText = document.getElementById("journal-text");
const journalColorPicker = document.getElementById("journal-color-picker");
const journalContainer = document.getElementById("journal-entry-container");

// Open Journal Modal when the button is clicked
journalButton.addEventListener("click", () => {
  journalModal.style.display = "flex"; // Show the modal
});

// Close Journal Modal
closeJournalModalButton.addEventListener("click", () => {
  journalModal.style.display = "none"; // Hide the modal
});

// Text formatting functionality
document.getElementById("bold-btn").addEventListener("click", () => {
  document.execCommand("bold");
});

document.getElementById("italic-btn").addEventListener("click", () => {
  document.execCommand("italic");
});

document.getElementById("underline-btn").addEventListener("click", () => {
  document.execCommand("underline");
});

document.getElementById("align-left-btn").addEventListener("click", () => {
  document.execCommand("justifyLeft");
});

document.getElementById("align-center-btn").addEventListener("click", () => {
  document.execCommand("justifyCenter");
});

document.getElementById("align-right-btn").addEventListener("click", () => {
  document.execCommand("justifyRight");
});

document.getElementById("bullet-btn").addEventListener("click", () => {
  document.execCommand("insertUnorderedList");
});

// Save and display journal entry
saveJournalButton.addEventListener("click", () => {
  const entryContent = journalText.innerHTML.trim();

  if (entryContent) {
    // Create a new journal entry
    const newEntry = document.createElement("div");
    newEntry.classList.add("journal-entry");
    newEntry.innerHTML = entryContent;

    // Apply the selected background color to the new entry
    newEntry.style.backgroundColor = journalText.style.backgroundColor;

    // Create a download link for the journal entry
    const downloadLink = document.createElement("a");
    downloadLink.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(entryContent);
    downloadLink.download = "journal_entry.txt";
    downloadLink.innerHTML = "Download Journal Entry";
    newEntry.appendChild(downloadLink);

    // Append the new entry to the journal container
    journalContainer.appendChild(newEntry);

    // Hide the journal editor box and clear the textarea
    journalModal.style.display = "none";
    journalText.innerHTML = "";

    // Make the new entry draggable and resizable
    makeDraggable(newEntry);
    makeResizable(newEntry);
  }
});

// To remove the journal entry from the page (when right-clicking)
journalContainer.addEventListener("contextmenu", (event) => {
  if (event.target.classList.contains("journal-entry")) {
    event.preventDefault(); // Prevent the default context menu from showing
    const confirmDelete = confirm(
      "Are you sure you want to delete this journal entry?"
    );
    if (confirmDelete) {
      journalContainer.removeChild(event.target); // Remove the journal entry from the container
    }
  }
});

// Add event listener for color picker input
journalColorPicker.addEventListener("input", function () {
  // Change the background color of the journal entry text area
  journalText.style.backgroundColor = journalColorPicker.value;
});

// Make an element draggable
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    document.body.style.cursor = "move";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      element.style.position = "absolute";
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.cursor = "default";
  });
}

// Make an element resizable
function makeResizable(element) {
  const resizer = document.createElement("div");
  resizer.style.width = "10px";
  resizer.style.height = "10px";
  resizer.style.backgroundColor = "#ccc";
  resizer.style.position = "absolute";
  resizer.style.bottom = "0";
  resizer.style.right = "0";
  resizer.style.cursor = "se-resize";

  element.appendChild(resizer);

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(window.getComputedStyle(element).width, 10);
    startHeight = parseInt(window.getComputedStyle(element).height, 10);
    document.body.style.cursor = "se-resize";
  });

  document.addEventListener("mousemove", (e) => {
    if (isResizing) {
      const width = startWidth + (e.clientX - startX);
      const height = startHeight + (e.clientY - startY);
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
    document.body.style.cursor = "default";
  });
}

//background
// Get elements
const backgroundChangeBtn = document.getElementById("background-change-btn");
const backgroundChangeModal = document.getElementById(
  "background-change-modal"
);
const closeModalBtn = document.getElementsByClassName("close")[0]; // Close button
const backgroundColorPicker = document.getElementById(
  "background-color-picker"
);
const backgroundImageUpload = document.getElementById(
  "background-image-upload"
);

// Show the modal when the button is clicked
backgroundChangeBtn.addEventListener("click", function () {
  backgroundChangeModal.style.display = "block"; // Show the modal
});

// Close the modal when the user clicks the close button (x)
closeModalBtn.addEventListener("click", function () {
  backgroundChangeModal.style.display = "none"; // Hide the modal
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === backgroundChangeModal) {
    backgroundChangeModal.style.display = "none"; // Hide the modal
  }
});

// Change background color when the color picker is used
backgroundColorPicker.addEventListener("input", function () {
  document.body.style.backgroundColor = backgroundColorPicker.value; // Change background color
});

// Change background image when the file is uploaded
backgroundImageUpload.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.body.style.backgroundImage = `url(${e.target.result})`;
      document.body.style.backgroundSize = "cover"; // Make sure the image covers the entire background
      document.body.style.backgroundPosition = "center"; // Center the image
    };
    reader.readAsDataURL(file);
  }
});

// Open music modal
// Open music modal
document.getElementById("music-button").addEventListener("click", () => {
  const musicModal = document.getElementById("music-modal");
  if (musicModal) {
    musicModal.style.display = "flex";
  }
});

// Close music modal when clicking outside
document.getElementById("music-modal").addEventListener("click", (event) => {
  const musicModal = document.getElementById("music-modal");
  if (event.target === musicModal) {
    musicModal.style.display = "none";
  }
});

// Declare audio variable

let isPlaying = false;
let isPaused = false;

// Upload music file and load metadata
document.getElementById("music-upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    // Create audio element and set its source
    audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener("loadedmetadata", () => {
      const musicDuration = audio.duration;
      document.getElementById("music-progress").max = musicDuration;
    });

    // Reset the UI on new file upload
    document.getElementById("pause-music").disabled = true;
    document.getElementById("play-music").disabled = false;
    document.getElementById("stop-music").disabled = false;
  }
});

// Play music
document.getElementById("play-music").addEventListener("click", () => {
  if (audio && !isPlaying) {
    audio.play();
    isPlaying = true;
    isPaused = false;
    document.getElementById("pause-music").disabled = false;
    document.getElementById("play-music").disabled = true;
  }
});

// Pause music
document.getElementById("pause-music").addEventListener("click", () => {
  if (audio && isPlaying) {
    audio.pause();
    isPlaying = false;
    isPaused = true;
    document.getElementById("pause-music").disabled = true;
    document.getElementById("play-music").disabled = false;
  }
});

// Stop music
document.getElementById("stop-music").addEventListener("click", () => {
  if (audio) {
    audio.currentTime = 0;
    audio.pause();
    isPlaying = false;
    isPaused = false;
    document.getElementById("pause-music").disabled = true;
    document.getElementById("play-music").disabled = false;
    document.getElementById("music-progress").value = 0;
    updateTimeDisplay();
  }
});

// Update progress and time display
document.getElementById("music-progress").addEventListener("input", (event) => {
  if (audio) {
    audio.currentTime = event.target.value;
  }
});

// Update progress and time display as music plays
audio?.addEventListener("timeupdate", () => {
  if (audio && !isPaused) {
    const progress = audio.currentTime;
    document.getElementById("music-progress").value = progress;
    updateTimeDisplay();
  }
});

// Update the time display
function updateTimeDisplay() {
  if (audio) {
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60);
    document.getElementById(
      "music-time"
    ).textContent = `${currentMinutes}:${currentSeconds
      .toString()
      .padStart(2, "0")} / ${totalMinutes}:${totalSeconds
      .toString()
      .padStart(2, "0")}`;
  }
}

/*
// Animation selection and application
const previewAnimations = document.querySelectorAll(".preview-animation");

previewAnimations.forEach((animation) => {
  animation.addEventListener("click", () => {
    previewAnimations.forEach((anim) => anim.classList.remove("selected"));
    animation.classList.add("selected");
  });
});

// Add selected animation to the page
document.getElementById("add-animation").addEventListener("click", () => {
  const selectedAnimation = document.querySelector(
    ".preview-animation.selected"
  );
  if (selectedAnimation) {
    const animationClone = selectedAnimation.cloneNode(true);
    const animationContainer = document.getElementById("animation-container");
    animationContainer.appendChild(animationClone);
    makeDraggableAndResizable(animationClone);
  }
});

// Make animations draggable and resizable
function makeDraggableAndResizable(element) {
  element.style.position = "absolute";
  let isResizing = false;
  let initialMouseX, initialMouseY, initialWidth, initialHeight;

  element.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resize-handle")) {
      isResizing = true;
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;
      initialWidth = element.offsetWidth;
      initialHeight = element.offsetHeight;
    } else {
      element.style.zIndex = 1000; // Bring to front when dragging starts
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (isResizing) {
      const dx = e.clientX - initialMouseX;
      const dy = e.clientY - initialMouseY;
      element.style.width = `${initialWidth + dx}px`;
      element.style.height = `${initialHeight + dy}px`;
    } else if (element.style.zIndex === "1000") {
      element.style.left = `${e.clientX - element.offsetWidth / 2}px`;
      element.style.top = `${e.clientY - element.offsetHeight / 2}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
    element.style.zIndex = 999; // Reset z-index after drag
  });
}

/*

// Music Player Modal: Open and Close
document.getElementById("music-button").addEventListener("click", () => {
  console.log("Opening music modal"); // Debug log to check if the button is clicked
  const musicModal = document.getElementById("music-modal");
  if (musicModal) {
    musicModal.style.display = "flex";
  }
});

// Close Music Modal (outside click)
document.getElementById("music-modal").addEventListener("click", (event) => {
  const musicModal = document.getElementById("music-modal");
  if (event.target === musicModal) {
    musicModal.style.display = "none";
  }
});

// Upload music file
document.getElementById("music-upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    audio.src = URL.createObjectURL(file);
    audio.addEventListener("loadedmetadata", () => {
      const musicDuration = audio.duration;
      document.getElementById("music-progress").max = musicDuration;
    });
  }
});

// Play music
document.getElementById("play-music").addEventListener("click", () => {
  if (!isPlaying) {
    audio.play();
    isPlaying = true;
    isPaused = false;
    document.getElementById("pause-music").disabled = false;
    document.getElementById("play-music").disabled = true;
  }
});

// Pause music
document.getElementById("pause-music").addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    isPaused = true;
    document.getElementById("pause-music").disabled = true;
    document.getElementById("play-music").disabled = false;
  }
});

// Stop music
document.getElementById("stop-music").addEventListener("click", () => {
  audio.currentTime = 0;
  audio.pause();
  isPlaying = false;
  isPaused = false;
  document.getElementById("pause-music").disabled = true;
  document.getElementById("play-music").disabled = false;
  document.getElementById("music-progress").value = 0;
  updateTimeDisplay();
});

// Music progress bar
document.getElementById("music-progress").addEventListener("input", (event) => {
  audio.currentTime = event.target.value;
});

// Update time display and progress bar
audio.addEventListener("timeupdate", () => {
  if (!isPaused) {
    const progress = audio.currentTime;
    document.getElementById("music-progress").value = progress;
    updateTimeDisplay();
  }
});

function updateTimeDisplay() {
  const currentMinutes = Math.floor(audio.currentTime / 60);
  const currentSeconds = Math.floor(audio.currentTime % 60);
  const totalMinutes = Math.floor(musicDuration / 60);
  const totalSeconds = Math.floor(musicDuration % 60);
  document.getElementById(
    "music-time"
  ).textContent = `${currentMinutes}:${currentSeconds
    .toString()
    .padStart(2, "0")} / ${totalMinutes}:${totalSeconds
    .toString()
    .padStart(2, "0")}`;
}

//about me modal:
// Get the modal
const aboutModal = document.getElementById("about-modal");

// Get the button that opens the modal
const aboutButton = document.getElementById("about-button");

// Get the <span> element that closes the modal
const closeAboutButton = document.getElementById("close-about");

// When the user clicks the button, open the modal
aboutButton.addEventListener("click", () => {
  aboutModal.style.display = "flex"; // Use flex to center, as per the existing modal behavior
});

// When the user clicks on <span> (x), close the modal
closeAboutButton.addEventListener("click", () => {
  aboutModal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target === aboutModal) {
    aboutModal.style.display = "none";
  }
});

//feedback

// Get the modal, button, and close elements
// Initialize EmailJS with your public API key
// Initialize EmailJS
emailjs.init("1fLu5tu41e6ZEJgit");

// Get the modal and the button
const modal = document.getElementById("feedback-modal");
const btn = document.getElementById("feedback-btn");
const closeBtn = document.getElementsByClassName("close")[0];

// Get the form and feedback elements
const form = document.getElementById("feedback-form");
const emailInput = document.getElementById("user-email");
const feedbackInput = document.getElementById("user-feedback");

// Open the modal when the button is clicked
btn.addEventListener("click", function () {
  modal.style.display = "flex"; // Show the modal
});

// Close the modal when the user clicks the close button (x)
closeBtn.addEventListener("click", function () {
  modal.style.display = "none"; // Hide the modal
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none"; // Hide the modal
  }
});

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Capture email and feedback values
  const userEmail = emailInput.value || "No email provided"; // Default to 'No email provided' if not given
  const userFeedback = feedbackInput.value;

  // Log the captured values to check if they are correct
  console.log("Email:", userEmail);
  console.log("Feedback:", userFeedback);

  // Send the feedback data to EmailJS
  emailjs
    .send("service_ch85cnn", "template_c7fbwjs", {
      user_name: userEmail,
      feedback_message: userFeedback,
    })
    .then(
      function (response) {
        alert("Feedback sent successfully!");
        form.reset(); // Reset the form after submission
        modal.style.display = "none"; // Close the modal after submission
      },
      function (error) {
        alert("Failed to send feedback. Please try again.");
        console.error("EmailJS Error:", error);
      }
    );
});

//journal entry
// Get elements
// Get references to elements
const journalButton = document.getElementById("journal-entry-btn");
const journalModal = document.getElementById("journalModal");
const closeJournalModalButton = document.getElementById("closeJournalModal");
const saveJournalButton = document.getElementById("saveJournal");
const journalText = document.getElementById("journalText");

// Open Journal Modal when the button is clicked
journalButton.addEventListener("click", () => {
  journalModal.style.display = "flex"; // Show the modal
});

// Close Journal Modal
closeJournalModalButton.addEventListener("click", () => {
  journalModal.style.display = "none"; // Hide the modal
});

// Text formatting functionality
document.getElementById("bold-btn").addEventListener("click", () => {
  document.execCommand("bold");
});

document.getElementById("italic-btn").addEventListener("click", () => {
  document.execCommand("italic");
});

document.getElementById("underline-btn").addEventListener("click", () => {
  document.execCommand("underline");
});

document.getElementById("align-left-btn").addEventListener("click", () => {
  document.execCommand("justifyLeft");
});

document.getElementById("align-center-btn").addEventListener("click", () => {
  document.execCommand("justifyCenter");
});

document.getElementById("align-right-btn").addEventListener("click", () => {
  document.execCommand("justifyRight");
});

document.getElementById("bullet-btn").addEventListener("click", () => {
  document.execCommand("insertUnorderedList");
});

// Save and display journal entry
submitJournalBtn.addEventListener("click", () => {
  const entryContent = journalTextArea.innerHTML.trim();

  if (entryContent) {
    // Create a new journal entry
    const newEntry = document.createElement("div");
    newEntry.classList.add("journal-entry");
    newEntry.innerHTML = entryContent;

    // Apply the selected background color to the new entry
    newEntry.style.backgroundColor = journalTextArea.style.backgroundColor;

    // Create a download link for the journal entry
    const downloadLink = document.createElement("a");
    downloadLink.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(entryContent);
    downloadLink.download = "journal_entry.txt";
    downloadLink.innerHTML = "Download Journal Entry";
    newEntry.appendChild(downloadLink);

    // Append the new entry to the journal container
    journalContainer.appendChild(newEntry);

    // Hide the journal editor box and clear the textarea
    journalEntryBox.style.display = "none";
    journalTextArea.innerHTML = "";

    // Make the new entry draggable and resizable
    makeDraggable(newEntry);
    makeResizable(newEntry);
  }
});

//To remove the journal entry from the page (when right-clicking)
journalContainer.addEventListener("contextmenu", (event) => {
  if (event.target.classList.contains("journal-entry")) {
    event.preventDefault(); // Prevent the default context menu from showing
    const confirmDelete = confirm(
      "Are you sure you want to delete this journal entry?"
    );
    if (confirmDelete) {
      journalContainer.removeChild(event.target); // Remove the journal entry from the container
    }
  }
});

const journalEntryContent = document.getElementById("journal-entry-content");
const journalColorPicker = document.getElementById("journal-color-picker");

// Add event listener for color picker input
journalColorPicker.addEventListener("input", function () {
  // Change the background color of the journal entry text area
  journalTextArea.style.backgroundColor = journalColorPicker.value;
});

// Make an element draggable
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    document.body.style.cursor = "move";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      element.style.position = "absolute";
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.cursor = "default";
  });
}

// Make an element resizable
function makeResizable(element) {
  const resizer = document.createElement("div");
  resizer.style.width = "10px";
  resizer.style.height = "10px";
  resizer.style.backgroundColor = "#ccc";
  resizer.style.position = "absolute";
  resizer.style.bottom = "0";
  resizer.style.right = "0";
  resizer.style.cursor = "se-resize";

  element.appendChild(resizer);

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(window.getComputedStyle(element).width, 10);
    startHeight = parseInt(window.getComputedStyle(element).height, 10);
    document.body.style.cursor = "se-resize";
  });

  document.addEventListener("mousemove", (e) => {
    if (isResizing) {
      const width = startWidth + (e.clientX - startX);
      const height = startHeight + (e.clientY - startY);
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
    document.body.style.cursor = "default";
  });
}

//change background image:
// Get elements
const backgroundChangeBtn = document.getElementById("background-change-btn");
const backgroundChangeModal = document.getElementById(
  "background-change-modal"
);
const closeModalBtn = document.getElementsByClassName("close")[0];
const backgroundColorPicker = document.getElementById(
  "background-color-picker"
);
const backgroundImageUpload = document.getElementById(
  "background-image-upload"
);

// Show the modal when the button is clicked
backgroundChangeBtn.addEventListener("click", function () {
  backgroundChangeModal.style.display = "block"; // Show the modal
});

// Close the modal when the user clicks the close button (x)
closeModalBtn.addEventListener("click", function () {
  backgroundChangeModal.style.display = "none"; // Hide the modal
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === backgroundChangeModal) {
    backgroundChangeModal.style.display = "none"; // Hide the modal
  }
});

// Change background color when the color picker is used
backgroundColorPicker.addEventListener("input", function () {
  document.body.style.backgroundColor = backgroundColorPicker.value; // Change background color
});

// Change background image when the file is uploaded
backgroundImageUpload.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.body.style.backgroundImage = `url(${e.target.result})`; // Set the uploaded image as background
      document.body.style.backgroundSize = "cover"; // Make sure the image covers the entire background
      document.body.style.backgroundPosition = "center"; // Center the image
    };
    reader.readAsDataURL(file);
  }
});


*/
