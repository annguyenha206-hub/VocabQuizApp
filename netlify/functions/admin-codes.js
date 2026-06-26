exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "" };
  if (!isAdmin(event)) return json(401, { error: "Unauthorized" });

  const sb = supabase();
  const r = await sb("access_codes?select=*,device_sessions(id,device_id,user_agent,first_used,last_used)&order=created_at.desc");
  if (!r.ok) return json(500, { error: "DB error" });

  return json(200, await r.json());
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
