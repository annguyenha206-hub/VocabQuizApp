// GET  /api/sync — fetch user's vocabulary + quizzes from cloud
// POST /api/sync — save user's vocabulary + quizzes to cloud
exports.handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return { statusCode: 405, body: "" };
  }

  const token = event.headers["x-session-token"];
  if (!token) return json(401, { error: "No token" });

  const sb = supabase();

  // Resolve token → code_id
  const sessionRes = await sb(
    "device_sessions?select=code_id,access_codes(active)&token=eq." + encodeURIComponent(token)
  );
  if (!sessionRes.ok) return json(500, { error: "DB error" });
  const sessions = await sessionRes.json();
  if (!sessions.length || !sessions[0].access_codes?.active) {
    return json(401, { error: "Invalid or expired session" });
  }

  const codeId = sessions[0].code_id;

  // ── GET: return stored data ──────────────────────────────
  if (event.httpMethod === "GET") {
    const r = await sb("user_data?code_id=eq." + codeId + "&select=vocabulary,saved_quizzes");
    if (!r.ok) return json(500, { error: "DB error" });
    const rows = await r.json();
    if (!rows.length) return json(200, { vocabulary: [], savedQuizzes: [] });
    return json(200, {
      vocabulary: rows[0].vocabulary || [],
      savedQuizzes: rows[0].saved_quizzes || [],
    });
  }

  // ── POST: upsert data ────────────────────────────────────
  const { vocabulary, savedQuizzes } = JSON.parse(event.body || "{}");
  const r = await sb("user_data", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      code_id: codeId,
      vocabulary: vocabulary || [],
      saved_quizzes: savedQuizzes || [],
      updated_at: new Date().toISOString(),
    }),
  });

  return json(r.ok ? 200 : 500, { ok: r.ok });
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
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
