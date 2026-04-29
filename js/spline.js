import { Application } from "../assets/runtime.js";

let app = null;

/* ======================
   BUBBLE (CHAT UI)
====================== */
function createBubble() {
  let bubble = document.getElementById("spline-bubble");

  if (!bubble) {
    bubble = document.createElement("div");
    bubble.id = "spline-bubble";
    document.body.appendChild(bubble);
  }

  return bubble;
}

function speak(text) {
  const bubble = createBubble();
  bubble.innerText = text;
  bubble.classList.add("show");

  clearTimeout(bubble._timer);
  bubble._timer = setTimeout(() => {
    bubble.classList.remove("show");
  }, 2500);
}

/* ======================
   BOT BEHAVIOR
====================== */
function initBotBehavior() {
  // 👋 Khi load trang
  setTimeout(() => {
    speak("Xin chào 👋 cần tui tư vấn giày không?");
  }, 800);

  // Hover menu
  const menuNam = document.querySelector('a[href*="men"]');
  const menuNu = document.querySelector('a[href*="women"]');
  const menuSale = document.querySelector('a[href*="sale"]');

  if (menuNam) {
    menuNam.addEventListener("mouseenter", () => {
      speak("Gu nam mạnh mẽ đó 😏");
    });
  }

  if (menuNu) {
    menuNu.addEventListener("mouseenter", () => {
      speak("Style nữ xịn xò nha 😏");
    });
  }

  if (menuSale) {
    menuSale.addEventListener("mouseenter", () => {
      speak("Sale đó 👀 không mua là tiếc đâu!");
    });
  }
}

/* ======================
   INIT SPLINE
====================== */
function initSpline() {
  if (app) return;

  let wrapper = document.getElementById("spline-wrapper");

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "spline-wrapper";

    const canvas = document.createElement("canvas");
    canvas.id = "spline-robot";

    wrapper.appendChild(canvas);
    document.body.appendChild(wrapper);
  }

  const canvas = document.getElementById("spline-robot");

  app = new Application(canvas);
  app.load("../assets/scene.splinecode");

  // 👇 bật AI bot
  initBotBehavior();
}

/* ======================
   RUN
====================== */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSpline);
} else {
  initSpline();
}