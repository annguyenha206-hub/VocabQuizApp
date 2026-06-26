exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };

  const { code, deviceId } = JSON.parse(event.body || "{}");
  if (!code) return json(400, { error: "Missing code" });

  const sb = supabase();

  const codesRes = await sb("access_codes?select=id,label&active=eq.true&code=eq." + encodeURIComponent(code.trim().toUpperCase()));
  if (!codesRes.ok) return json(500, { error: "DB error" });
  const codes = await codesRes.json();
  if (!codes.length) return json(401, { error: "Invalid or inactive code" });

  const codeRow = codes[0];
  const token = require("crypto").randomUUID();

  const sessionRes = await sb("device_sessions", {
    method: "POST",
    body: JSON.stringify({
      code_id: codeRow.id,
      token,
      device_id: deviceId || "unknown",
      user_agent: event.headers["user-agent"] || "",
    }),
  });
  if (!sessionRes.ok) return json(500, { error: "Session error" });

  return json(200, { token, label: codeRow.label });
};

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  return (path, options = {}) =>
    fetch(`${url}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(options.headers || {}),
      },
    });
}

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
