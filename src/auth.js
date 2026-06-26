(async function () {
  const root = document.getElementById("root");
  const TOKEN_KEY = "VQ_SESSION_TOKEN";
  const DEVICE_KEY = "VQ_DEVICE_ID";

  // Skip auth in local development
  const isLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  if (isLocal) { loadApp(); return; }

  // Show loading while checking
  root.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:var(--text,#1a2e1f)"><p>Đang kiểm tra...</p></div>`;

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const res = await fetch("/api/check-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const { valid } = await res.json();
      if (valid) { loadApp(); return; }
    } catch {
      // Network error — fail open so app isn't completely broken
      loadApp(); return;
    }
    // Token invalid — clear it and show gate
    localStorage.removeItem(TOKEN_KEY);
  }

  showGate();

  function showGate(errorMsg) {
    root.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg,#f4f7f4);padding:24px">
        <div style="background:var(--surface,#fff);border:1.5px solid var(--line,#d4e0d4);border-radius:16px;padding:40px 36px;max-width:360px;width:100%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.07)">
          <div style="font-size:2.2rem;margin-bottom:8px">📚</div>
          <h1 style="font-size:1.4rem;margin:0 0 6px;color:var(--text,#1a2e1f)">Luyện Từ Vựng</h1>
          <p style="color:var(--text-muted,#5a7a5a);margin:0 0 28px;font-size:.95rem">Nhập mã truy cập để tiếp tục</p>
          <form id="auth-form">
            <input id="code-input" type="text" placeholder="Ví dụ: BLUE-TIGER-1234"
              autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false"
              style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid var(--line,#c8d8c8);border-radius:8px;font-size:1rem;background:var(--surface,#fff);color:var(--text,#1a2e1f);margin-bottom:12px;text-align:center;letter-spacing:.08em" />
            ${errorMsg ? `<p style="color:#c0392b;font-size:.88rem;margin:0 0 10px">${errorMsg}</p>` : ""}
            <button type="submit"
              style="width:100%;padding:12px;background:linear-gradient(135deg,#2e9e6b,#27a85f);color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer">
              Vào
            </button>
          </form>
        </div>
      </div>`;

    const form = document.getElementById("auth-form");
    const input = document.getElementById("code-input");
    input.focus();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = input.value.trim().toUpperCase();
      if (!code) return;

      const btn = form.querySelector("button");
      btn.disabled = true;
      btn.textContent = "Đang kiểm tra...";

      try {
        const res = await fetch("/api/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, deviceId: getDeviceId() }),
        });
        if (!res.ok) throw new Error("invalid");
        const { token } = await res.json();
        localStorage.setItem(TOKEN_KEY, token);
        loadApp();
      } catch {
        showGate("Mã không hợp lệ. Vui lòng thử lại.");
      }
    });
  }

  function getDeviceId() {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(DEVICE_KEY, id); }
    return id;
  }

  function loadApp() {
    const s = document.createElement("script");
    s.src = "./src/app-runtime.js";
    document.body.appendChild(s);
  }
})();
