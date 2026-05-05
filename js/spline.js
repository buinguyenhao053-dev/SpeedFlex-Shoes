import { Application } from "../assets/runtime.js";

let app = null;

/* ======================
   BUBBLE
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
  setTimeout(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const name = user?.hoten || user?.email || "bạn";

    speak(`Chào ${name} 👋 bạn có muốn tư vấn giày không?`);
  }, 800);

  document.querySelectorAll('a[href*="men"]').forEach(el =>
    el.addEventListener("mouseenter", () => speak("Gu nam mạnh mẽ đó 😏"))
  );

  document.querySelectorAll('a[href*="women"]').forEach(el =>
    el.addEventListener("mouseenter", () => speak("Style nữ xịn xò nha 😏"))
  );

  document.querySelectorAll('a[href*="sale"]').forEach(el =>
    el.addEventListener("mouseenter", () => speak("Sale đó 👀 không mua là tiếc đâu!"))
  );
}

/* ======================
   ROUTES (🔥 QUAN TRỌNG)
====================== */
const ROUTES = {
  "giày nam": "../html/men.html",
  "giày nữ": "../html/women.html",

  "sneaker nữ": "../html/women.html",
  "sneaker": "../html/men.html",

  "chạy bộ": "../html/men.html",
  "giày thể thao": "../html/men.html",

  "sandal": "../html/women.html",
  "giày chạy": "../html/women.html",

  "sale": "../html/sale.html",
  "sale 30%": "../html/sale.html",
  "sale 50%": "../html/sale.html",
};

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

  canvas.addEventListener("click", () => {
    wrapper.style.display = "none";
    openChatBox();
  });

  app = new Application(canvas);
  app.load("../assets/scene.splinecode");

  initBotBehavior();
}

/* ======================
   RUN
====================== */
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initSpline)
  : initSpline();

/* ======================
   CHAT LOGIC
====================== */
function handleUserMessage(text) {
  const body = document.getElementById("chat-body");

  // 👉 USER
  const userMsg = document.createElement("div");
  userMsg.className = "user-msg";
  userMsg.innerText = text;
  body.appendChild(userMsg);

  // 👉 CHECK ROUTE (🔥 CHẶN LIÊN HỆ)
  for (let key in ROUTES) {
    if (text.includes(key)) {
      window.location.href = ROUTES[key];
      return;
    }
  }

  // 👉 BOT LOGIC
  let reply = "";
  let suggestions = [];

  if (text.includes("nam")) {
    reply = "Giày nam đang hot 😏 bạn muốn xem loại nào?";
    suggestions = ["Sneaker", "Chạy bộ", "Giày thể thao"];
  } else if (text.includes("nữ")) {
    reply = "Style nữ xịn xò 🔥 chọn thử đi!";
    suggestions = ["Sneaker nữ", "Sandal", "Giày chạy"];
  } else if (text.includes("sale")) {
    reply = "Đang sale mạnh 👀 chọn nhanh!";
    suggestions = ["Sale 30%", "Sale 50%", "Hàng hot"];
  } else if (text.includes("size")) {
    reply = "Bạn muốn chọn size theo gì?";
    suggestions = ["Theo chiều dài chân", "Theo size Nike", "Tư vấn trực tiếp"];
  } else {
    reply = "Bạn vui lòng liên hệ 0909.xxx.xxx để được hỗ trợ ☎️";
  }

  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.className = "bot-msg";
    botMsg.innerText = reply;
    body.appendChild(botMsg);

    if (suggestions.length > 0) {
      renderQuickReplies(suggestions);
    }

    body.scrollTop = body.scrollHeight;
  }, 300);
}

/* ======================
   OPEN CHAT
====================== */
function openChatBox() {
  let box = document.getElementById("chatbox");

  if (!box) {
    box = document.createElement("div");
    box.id = "chatbox";

    box.innerHTML = `
      <div class="chat-header">
        <div class="chat-title">
          <div class="bot-avatar">🤖</div>
          <div>
            <div class="chat-name">HAO SHOES</div>
            <div class="chat-status">Đang online</div>
          </div>
        </div>
        <span id="close-chat">✕</span>
      </div>

      <div class="chat-body" id="chat-body">
        <div class="bot-msg">Chào bạn 😏 bạn cần tư vấn gì?</div>

        <div class="quick-wrap">
          <div class="quick-btn">Giày nam</div>
          <div class="quick-btn">Giày nữ</div>
          <div class="quick-btn">Đang sale</div>
          <div class="quick-btn">Chọn size</div>
        </div>
      </div>

      <div class="chat-input">
        <input type="text" id="chat-input" placeholder="Nhập tin nhắn..." />
        <button id="send-btn">➤</button>
      </div>
    `;

    document.body.appendChild(box);
  }

  box.style.display = "flex";
}

/* ======================
   QUICK REPLIES
====================== */
function renderQuickReplies(options) {
  const body = document.getElementById("chat-body");

  const old = body.querySelector(".quick-wrap");
  if (old) old.remove();

  const wrap = document.createElement("div");
  wrap.className = "quick-wrap";

  options.forEach((opt) => {
    const btn = document.createElement("div");
    btn.className = "quick-btn";
    btn.innerText = opt;

    // btn.onclick = () => handleUserMessage(opt.toLowerCase());

    wrap.appendChild(btn);
  });

  body.appendChild(wrap);
  body.scrollTo({
    top: body.scrollHeight,
    behavior: "smooth",
  });
}

/* ======================
   EVENTS
====================== */

// Enter
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const input = document.getElementById("chat-input");
  if (!input || !input.value.trim()) return;

  handleUserMessage(input.value.trim().toLowerCase());
  input.value = "";
});

// Send button
document.addEventListener("click", (e) => {
  if (e.target.id === "send-btn") {
    const input = document.getElementById("chat-input");
    if (!input.value.trim()) return;

    handleUserMessage(input.value.trim().toLowerCase());
    input.value = "";
  }
});

// Close
document.addEventListener("click", (e) => {
  if (e.target.id === "close-chat") {
    document.getElementById("chatbox").style.display = "none";
    document.getElementById("spline-wrapper").style.display = "block";
  }
});

// Quick click (global)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("quick-btn")) {
    handleUserMessage(e.target.innerText.toLowerCase());
  }
});