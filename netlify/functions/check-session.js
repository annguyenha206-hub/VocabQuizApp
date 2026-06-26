exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };

  const { token } = JSON.parse(event.body || "{}");
  if (!token) return json(200, { valid: false });

  const sb = supabase();

  const r = await sb("device_sessions?select=id,access_codes(active)&token=eq." + encodeURIComponent(token));
  if (!r.ok) return json(200, { valid: false });

  const rows = await r.json();
  if (!rows.length || !rows[0].access_codes?.active) return json(200, { valid: false });

  await sb("device_sessions?token=eq." + encodeURIComponent(token), {
    method: "PATCH",
    body: JSON.stringify({ last_used: new Date().toISOString() }),
  });

  return json(200, { valid: true });
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
