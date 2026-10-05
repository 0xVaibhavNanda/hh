/* ==========================================================================
   SCRIPT.JS - Romantic Apology Digital Love Card for Sneha
   State management, smooth transitions, typewriter engine, interactive choices,
   Clipboard copying + Direct WhatsApp message opening.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG BLOCK - CUSTOMIZE YOUR DETAILS HERE
   -------------------------------------------------------------------------- */
const CONFIG = {
  // Your name as it should appear on the final screen signature
  YOUR_NAME: "Your Name",

  // Your WhatsApp Phone Number with Country Code (without + or spaces)
  // Default set to: 919736360809
  WHATSAPP_NUMBER: "919736360809",

  // Background Music file path
  MUSIC_FILE: "music.mp3",

  // Personal sweet memory to display on Screen 7
  PERSONAL_MEMORY: "Remember that chilly evening when we sat together, shared warm chai, and talked about everything and nothing? I felt so close to you that day, and I promise to keep building moments like that with you."
};

let currentScreen = 1;
let typewriterActive = false;
let typewriterTimeout = null;
let fullTypewriterText = "Sneha… before anything else, I just want you to know I'm here, and I'm listening.";

const selectedChoices = new Set();
let customWriteInText = "";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  initParticles();
  initMusicPlayer();
});

function initApp() {
  const signatureEl = document.getElementById("signatureText");
  if (signatureEl) {
    signatureEl.textContent = `— ${CONFIG.YOUR_NAME}`;
  }

  const memoryEl = document.getElementById("personalMemoryText");
  if (memoryEl && CONFIG.PERSONAL_MEMORY && CONFIG.PERSONAL_MEMORY !== "[ADD A SWEET MEMORY OF US HERE]") {
    memoryEl.textContent = CONFIG.PERSONAL_MEMORY;
  }

  setupEnvelopeListener();
  setupNavigationButtons();
  setupChoicesGrid();
  setupSendLogic();
  setupRestartButton();
}

function goToScreen(screenNumber) {
  if (screenNumber < 1 || screenNumber > 11) return;

  const currentEl = document.getElementById(`screen${currentScreen}`);
  const nextEl = document.getElementById(`screen${screenNumber}`);

  if (!nextEl) return;

  if (currentEl) {
    currentEl.style.opacity = "0";
    currentEl.style.transform = "translateY(-15px)";
    setTimeout(() => {
      currentEl.classList.remove("active");
    }, 300);
  }

  setTimeout(() => {
    nextEl.classList.add("active");
    void nextEl.offsetWidth;
    nextEl.style.opacity = "1";
    nextEl.style.transform = "translateY(0)";
    
    currentScreen = screenNumber;
    updateProgressBar();
    handleScreenSpecificTriggers(screenNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 320);
}

function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;

  if (currentScreen === 1) {
    progressBar.classList.add("hidden");
  } else {
    progressBar.classList.remove("hidden");
  }

  const dots = progressBar.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    const dotScreen = idx + 1;
    dot.classList.remove("active", "completed");
    if (dotScreen === currentScreen) {
      dot.classList.add("active");
    } else if (dotScreen < currentScreen) {
      dot.classList.add("completed");
    }
  });
}

function handleScreenSpecificTriggers(screenNumber) {
  switch (screenNumber) {
    case 2:
      startTypewriterEffect();
      break;
    case 5:
      triggerSequentialReveal();
      break;
    case 8:
      triggerScreen8Hearts();
      break;
    case 10:
      populateSelectionSummary();
      break;
    case 11:
      triggerFinalBurst();
      break;
  }
}

function setupEnvelopeListener() {
  const envelope = document.getElementById("envelope");
  if (!envelope) return;

  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("open")) return;
    
    envelope.classList.add("open");
    
    setTimeout(() => {
      goToScreen(2);
    }, 700);
  });
}

function startTypewriterEffect() {
  const textEl = document.getElementById("typewriterText");
  const cursorEl = document.getElementById("typewriterCursor");
  if (!textEl) return;

  textEl.textContent = "";
  if (cursorEl) cursorEl.style.display = "inline";

  let charIndex = 0;
  typewriterActive = true;

  function typeChar() {
    if (!typewriterActive) return;

    if (charIndex < fullTypewriterText.length) {
      textEl.textContent += fullTypewriterText.charAt(charIndex);
      charIndex++;
      const speed = Math.floor(Math.random() * 40) + 45;
      typewriterTimeout = setTimeout(typeChar, speed);
    } else {
      typewriterActive = false;
      if (cursorEl) {
        setTimeout(() => { cursorEl.style.display = "none"; }, 1500);
      }
    }
  }

  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  typeChar();
}

function completeTypewriterInstantly() {
  if (!typewriterActive) return;
  typewriterActive = false;
  if (typewriterTimeout) clearTimeout(typewriterTimeout);

  const textEl = document.getElementById("typewriterText");
  const cursorEl = document.getElementById("typewriterCursor");
  if (textEl) textEl.textContent = fullTypewriterText;
  if (cursorEl) cursorEl.style.display = "none";
}

function triggerSequentialReveal() {
  const cards = [
    document.getElementById("feelCard1"),
    document.getElementById("feelCard2"),
    document.getElementById("feelCard3")
  ];

  cards.forEach((card) => {
    if (card) card.classList.remove("visible");
  });

  cards.forEach((card, index) => {
    if (card) {
      setTimeout(() => {
        card.classList.add("visible");
      }, (index + 1) * 350);
    }
  });
}

function triggerScreen8Hearts() {
  const container = document.getElementById("screen8Hearts");
  if (!container) return;
  container.innerHTML = "";

  const heartSymbols = ["🤍", "💖", "🌸", "💓", "✨"];
  for (let i = 0; i < 8; i++) {
    const span = document.createElement("span");
    span.className = "screen-heart";
    span.textContent = heartSymbols[i % heartSymbols.length];
    span.style.left = `${Math.random() * 85 + 5}%`;
    span.style.animationDelay = `${Math.random() * 2}s`;
    span.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
    container.appendChild(span);
  }
}

function setupChoicesGrid() {
  const choiceCards = document.querySelectorAll(".choice-card");
  const errorEl = document.getElementById("choiceValidationError");

  choiceCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "textarea") return;

      const choiceId = card.getAttribute("data-choice-id");
      const isSelected = card.classList.contains("selected");

      if (isSelected) {
        card.classList.remove("selected");
        card.setAttribute("aria-checked", "false");
        selectedChoices.delete(choiceId);
        
        const resp = card.querySelector(".choice-response");
        if (resp) resp.classList.add("hidden");

        if (choiceId === "custom") {
          const customBox = document.getElementById("customInputWrapper");
          if (customBox) customBox.classList.add("hidden");
        }
      } else {
        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");
        selectedChoices.add(choiceId);

        const resp = card.querySelector(".choice-response");
        if (resp) resp.classList.remove("hidden");

        if (choiceId === "custom") {
          const customBox = document.getElementById("customInputWrapper");
          if (customBox) {
            customBox.classList.remove("hidden");
            const textarea = document.getElementById("customText");
            if (textarea) textarea.focus();
          }
        }
      }

      if (selectedChoices.size > 0 && errorEl) {
        errorEl.classList.add("hidden");
      }
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (e.target.tagName.toLowerCase() !== "textarea") {
          e.preventDefault();
          card.click();
        }
      }
    });
  });

  const toSendBtn = document.getElementById("toSendBtn");
  if (toSendBtn) {
    toSendBtn.addEventListener("click", () => {
      if (selectedChoices.size === 0) {
        if (errorEl) {
          errorEl.classList.remove("hidden");
        }
      } else {
        if (errorEl) errorEl.classList.add("hidden");
        goToScreen(10);
      }
    });
  }
}

const CHOICE_LABELS = {
  hugs: "🤗 Hugs & Cuddles",
  chocolates: "🍫 Chocolates & Cake",
  talk: "🌙 A long, quiet cuddle where you just talk and I just listen",
  movie: "🎬 Movie night under a blanket",
  date: "🌹 A little date, just us",
  kisses: "💋 Forehead kisses and being held",
  custom: "✍️ Something else..."
};

function populateSelectionSummary() {
  const summaryEl = document.getElementById("selectionSummary");
  if (!summaryEl) return;

  summaryEl.innerHTML = "";

  if (selectedChoices.size === 0) {
    summaryEl.innerHTML = `<p class="summary-item">No choices selected yet 🥺</p>`;
    return;
  }

  selectedChoices.forEach((id) => {
    const item = document.createElement("div");
    item.className = "summary-item";
    item.innerHTML = `<span>🤍</span> <span>${CHOICE_LABELS[id] || id}</span>`;
    summaryEl.appendChild(item);
  });

  const customTextEl = document.getElementById("customText");
  if (selectedChoices.has("custom") && customTextEl && customTextEl.value.trim() !== "") {
    customWriteInText = customTextEl.value.trim();
    const customDiv = document.createElement("div");
    customDiv.className = "summary-custom";
    customDiv.innerHTML = `<strong>Her wish:</strong> "${customWriteInText}"`;
    summaryEl.appendChild(customDiv);
  }
}

function setupSendLogic() {
  const sendBtn = document.getElementById("sendAnswerBtn");
  const feedbackEl = document.getElementById("sendFeedback");
  const fallbackBox = document.getElementById("fallbackContainer");
  const whatsappLink = document.getElementById("whatsappDirectLink");

  if (!sendBtn) return;

  sendBtn.addEventListener("click", () => {
    if (selectedChoices.size === 0) {
      goToScreen(9);
      return;
    }

    const choiceNames = Array.from(selectedChoices).map((id) => CHOICE_LABELS[id] || id);
    const customTextEl = document.getElementById("customText");
    const customVal = (selectedChoices.has("custom") && customTextEl) ? customTextEl.value.trim() : "";

    let messageText = `💌 Sneha chose:\n` + choiceNames.map(c => `• ${c}`).join("\n");
    if (customVal) {
      messageText += `\n\n✍️ Custom note: "${customVal}"`;
    }
    messageText += `\n\n🥺💗`;

    copyToClipboard(messageText);

    const cleanPhone = CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

    if (feedbackEl) {
      feedbackEl.className = "feedback-msg info";
      feedbackEl.textContent = "Copied your answer & opening WhatsApp! 💬";
      feedbackEl.classList.remove("hidden");
    }

    if (fallbackBox) fallbackBox.classList.remove("hidden");
    if (whatsappLink) {
      whatsappLink.href = waUrl;
    }

    window.open(waUrl, "_blank");

    setTimeout(() => {
      const continueBtn = document.createElement("button");
      continueBtn.className = "btn btn-primary nav-btn";
      continueBtn.style.marginTop = "16px";
      continueBtn.textContent = "Continue to my love note 🤍";
      continueBtn.addEventListener("click", () => goToScreen(11));
      
      if (fallbackBox && !fallbackBox.querySelector(".nav-btn")) {
        fallbackBox.appendChild(continueBtn);
      }
    }, 600);
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(err => console.warn("Clipboard copy failed:", err));
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.warn("Fallback execCommand copy failed:", err);
    }
    document.body.removeChild(textarea);
  }
}

function triggerFinalBurst() {
  createHeartBurst();
}

function createHeartBurst() {
  const symbols = ["🤍", "💖", "🌸", "✨", "❤️", "🧸", "🌹"];
  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.position = "fixed";
      el.style.left = `${Math.random() * 90 + 5}vw`;
      el.style.top = `${Math.random() * 80 + 10}vh`;
      el.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;
      el.style.pointerEvents = "none";
      el.style.zIndex = "999";
      el.style.transition = "all 2.5s ease-out";
      el.style.opacity = "1";
      el.style.transform = "scale(0.5) translateY(0)";

      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.opacity = "0";
        el.style.transform = `scale(${Math.random() * 1.5 + 1}) translateY(-${Math.random() * 100 + 80}px) rotate(${Math.random() * 360}deg)`;
      });

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 2600);
    }, i * 70);
  }
}

function setupRestartButton() {
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      goToScreen(1);
      const envelope = document.getElementById("envelope");
      if (envelope) envelope.classList.remove("open");
    });
  }
}

function setupNavigationButtons() {
  const navBtns = document.querySelectorAll(".nav-btn[data-next]");

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentScreen === 2 && typewriterActive) {
        completeTypewriterInstantly();
      }

      const nextScreen = parseInt(btn.getAttribute("data-next"), 10);
      if (nextScreen) {
        goToScreen(nextScreen);
      }
    });
  });
}

function initMusicPlayer() {
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicText = document.getElementById("musicText");

  if (!bgMusic || !musicToggle) return;

  if (CONFIG.MUSIC_FILE && CONFIG.MUSIC_FILE !== "music.mp3") {
    bgMusic.src = CONFIG.MUSIC_FILE;
  }

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicToggle.classList.add("playing");
        if (musicText) musicText.textContent = "Sound On";
      }).catch((err) => {
        console.warn("Audio playback blocked by browser:", err);
      });
    } else {
      bgMusic.pause();
      musicToggle.classList.remove("playing");
      if (musicText) musicText.textContent = "Sound Off";
    }
  });
}

function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 20;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.type = Math.random() > 0.4 ? "heart" : "sparkle";
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.2;
      this.rotation += this.rotationSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === "heart") {
        ctx.fillStyle = "rgba(232, 165, 184, 0.7)";
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(
          -this.size / 2, -topCurveHeight,
          -this.size, this.size / 3,
          0, this.size
        );
        ctx.bezierCurveTo(
          this.size, this.size / 3,
          this.size / 2, -topCurveHeight,
          0, topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(247, 231, 180, 0.8)";
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size * 0.6, Math.sin((i * Math.PI) / 2) * this.size * 0.6);
          ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.2, Math.sin((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.2);
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
