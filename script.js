const keys = document.querySelectorAll("[data-key]");
const buttons = document.querySelectorAll("button");
const playBtn = document.getElementById("play");
const clearBtn = document.getElementById("clear");

function isMarkActive() {
  const markBtn = Array.from(buttons).find(
    (btn) => btn.innerText === "Mark" && btn.classList.contains("active")
  );
  return !!markBtn;
}

function updatePlayClearVisibility() {
  const labels = [
    ...document.querySelectorAll("kbd"),
    ...document.querySelectorAll("span"),
  ];
  const anyGreen = labels.some((label) => label.style.color === "red");

  if (anyGreen) {
    playBtn.style.display = "inline-block";
    clearBtn.style.display = "inline-block";
  } else {
    playBtn.style.display = "none";
    clearBtn.style.display = "none";
  }
}

function playNote(note, keyElement) {
  const encodedNote = encodeURIComponent(note);
  const audio = new Audio(`sounds/${encodedNote}.wav`);
  audio.onerror = () => new Audio(`sounds/${encodedNote}.mp3`).play();
  audio.play();

  if (isMarkActive()) {
    const label =
      keyElement.querySelector("kbd") || keyElement.querySelector("span");
    if (label) {
      label.style.color = "red";
    }
  }
  updatePlayClearVisibility();
}

keys.forEach((keyElement) => {
  keyElement.addEventListener("click", () => {
    const note = keyElement.getAttribute("data-key").toUpperCase();
    playNote(note, keyElement);
  });
});

clearBtn.addEventListener("click", () => {
  const allKeys = document.querySelectorAll("[data-key]");

  allKeys.forEach((key) => {
    const label = key.querySelector("kbd") || key.querySelector("span");
    if (label && label.style.color === "red") {
      if (key.classList.contains("b-key")) {
        label.style.color = "white";
      } else {
        label.style.color = "black";
      }
    }
  });

  playBtn.style.display = "none";
  clearBtn.style.display = "none";
});

playBtn.addEventListener("click", () => {
  const redNotes = [];

  keys.forEach((key) => {
    const label = key.querySelector("kbd") || key.querySelector("span");
    if (label && label.style.color === "red") {
      const note = key.getAttribute("data-key").toUpperCase();
      redNotes.push(note);
    }
  });

  redNotes.forEach((note, index) => {
    setTimeout(() => {
      playNote(note);
    }, index * 500);
  });
});

document.addEventListener("keydown", (e) => {
  const pressedKey = e.key.toUpperCase();
  const keyElement = document.querySelector(`[data-key="${pressedKey}"]`);
  if (keyElement) {
    playNote(pressedKey, keyElement);
  }
});

const activeBtn = document.querySelectorAll("button");

// button events
activeBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.innerText === "Mark") {
      btn.classList.toggle("active");
    } else {
      activeBtn.forEach((b) => {
        if (b.innerText !== "Mark") b.classList.remove("active");
      });
      btn.classList.add("active");
    }

    // Show/hide notes logic
    const kbdNotes = document.getElementsByTagName("kbd");
    const spanNotes = document.getElementsByTagName("span");

    if (btn.innerHTML == "Hide Notes") {
      for (let i = 0; i < kbdNotes.length; i++) {
        kbdNotes[i].style.display = "none";
      }
      for (let i = 0; i < spanNotes.length; i++) {
        spanNotes[i].style.display = "none";
      }
      btn.innerHTML = "Show Notes";
    } else if (btn.innerHTML == "Show Notes") {
      for (let i = 0; i < kbdNotes.length; i++) {
        kbdNotes[i].style.display = "block";
      }
      for (let i = 0; i < spanNotes.length; i++) {
        spanNotes[i].style.display = "inline";
      }
      btn.innerHTML = "Hide Notes";
    }
  });
});
