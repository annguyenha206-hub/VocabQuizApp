exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  if (!isAdmin(event)) return json(401, { error: "Unauthorized" });

  const { id, active } = JSON.parse(event.body || "{}");
  if (!id || active === undefined) return json(400, { error: "Missing id or active" });

  const sb = supabase();
  const r = await sb("access_codes?id=eq." + encodeURIComponent(id), {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
  if (!r.ok) return json(500, { error: "DB error" });

  return json(200, { ok: true });
};

function isAdmin(event) {
  return event.headers["x-admin-key"] === process.env.ADMIN_KEY;
}

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
